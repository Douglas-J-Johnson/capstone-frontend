import React from 'react';
import LoginSignupHeader from './components/LoginSignupHeader'
import LoggedInHeader from './components/LoggedInHeader'
import Entry from './components/Entry'
import Tools from './components/Tools'
import './App.css';
const WatsonSpeech = require('watson-speech');

const BASE_URL = "http://localhost:3000";
const GENERATE_TOKEN = `${BASE_URL}/generate_service_token?service_name=`;
const TA_ENDPOINT = '/v3/tone';
const TA_VERSION = '2017-09-21';
const PI_ENDPOINT = '/v3/profile';
const PI_VERSION = '2017-10-13';
const NLU_ENDPOINT = '/v1/analyze';
const NLU_VERSION = '2019-07-12';

let stream = null

class App extends React.Component {
  constructor() {
    let loggedin = false
    if(localStorage.getItem('token') !== "" && localStorage.getItem('token') !== null) {
      loggedin = true
    }

    super()
    this.state = {
      loggedin: loggedin,
      loginSignup: 'login',
      editRead: 'edit',
      searchAnalyze: 'analyze',
      recording: false,
      analyzing: false,
      credentialsRefreshTime: 0,
      credentials: {
        stt : {url: '', token: ''},
        pi : {url: '', token: ''},
        ta : {url: '', token: ''},
        nlu : {url: '', token: ''},
      },
      entryText: ""
    }
  }
  
  getServiceToken = async (service) => {
    let response = await fetch(`${GENERATE_TOKEN}${service}`, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    });
    let parsedResponse = await response.json();
    return parsedResponse;
  }

  refreshCredentials = async function () {
    let credentials = Object.assign({}, this.state.credentials);
    const credentialsRefreshTime = new Date().getTime();

    let stt = this.getServiceToken('speech_to_text')
    let ta = this.getServiceToken('tone_analyzer');
    let pi = this.getServiceToken('personality_insights');
    let nlu = this.getServiceToken('natural_language_understanding');
  
    let tokens = await Promise.all([stt, ta, pi, nlu]);
  
    credentials.stt.token = `Bearer ${tokens[0].iam_token}`;
    credentials.pi.token = `Bearer ${tokens[1].iam_token}`;
    credentials.ta.token = `Bearer ${tokens[2].iam_token}`;
    credentials.nlu.token = `Bearer ${tokens[3].iam_token}`;
    credentials.stt.url = tokens[0].api_url;
    credentials.pi.url = tokens[1].api_url;
    credentials.ta.url = tokens[2].api_url;
    credentials.nlu.url = tokens[3].api_url;
  
    console.log('Credentials Refreshed', credentials);
    this.setState({credentials, credentialsRefreshTime});
  }

  eventDataReceived = (data) => {
    console.log('Speech to Text Data:', data)
  }

  eventErrorReceived = (error) => {
    console.log('Speech to Text Error:', error)
  }

  startRecording = () => {
    let recording = this.state.recording
    const credentials = this.state.credentials

    if(!recording) {
      this.refreshCredentials()
      .then(() => {
          recording = true

          stream = WatsonSpeech.SpeechToText.recognizeMicrophone({accessToken: credentials.stt.token})

          stream.on('data', this.eventDataReceived)
          stream.on('error', this.eventErrorReceived)

          this.setState({recording})
        }
      )
      .catch(error => console.log('Credential Refresh Error', error));
    }
  }

  stopRecording = () => {
    let recording = this.state.recording

    if(recording) {
        recording = false

        stream.stop()

        this.setState({recording})
    }
  }

  analyzeEntry = () => {
    const entryText = this.state.entryText

    this.refreshCredentials()
    this.analyzeText(entryText)
  }

  analyzeText = async function (textToAnalyze) {
    const credentials = this.state.credentials

    let ta = this.getToneAnalysis(
      credentials.ta.url,
      `Bearer ${credentials.ta.token}`,
      textToAnalyze
    )
    let pi = this.getPersonalityInsights(
      credentials.pi.url,
      `Bearer ${credentials.pi.token}`,
      textToAnalyze
    )
    /*let nlu = getNaturalLanguageUnderstanding(
      credentials.nlu.url,
      `Bearer ${credentials.nlu.token}`,
      textToAnalyze
    )*/
  
    let analyses = await Promise.all([ta, pi])
  
    console.log("Analyses Completed", analyses)
  }

  getToneAnalysis = async function (serviceURL, serviceToken, textToAnalyze) {
    console.log(serviceURL)
    console.log(serviceToken)
    let response = await fetch(serviceURL, 
      {
        method: 'POST',
        headers: {
          'Authorization': serviceToken,
          'Content-Type': 'text/plain',
          'Accept': 'application/json'
        },
        body: textToAnalyze
      }
    );
    let parsedResponse = await response.json();
    return parsedResponse
  }
  
  getPersonalityInsights= async function (serviceURL, serviceToken, textToAnalyze) {
    console.log(serviceURL)
    console.log(serviceToken)
    let response = await fetch(serviceURL, 
      {
        method: 'POST',
        headers: {
          'Authorization': serviceToken,
          'Content-Type': 'text/plain',
          'Accept': 'application/json'
        },
        body: textToAnalyze
      }
    );
    let parsedResponse = await response.json();
    return parsedResponse
  }
  
  //Needs work
  // getNaturalLanguageUnderstanding = async function (serviceURL, serviceToken, textToAnalyze) {
  //   console.log(serviceURL)
  //   console.log(serviceToken)
  //   let response = await fetch(serviceURL, 
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': serviceToken,
  //         'Content-Type': 'text/plain',
  //         'Accept': 'application/json'
  //       },
  //       body: textToAnalyze
  //     }
  //   );
  //   let parsedResponse = await response.json();
  //   console.log(parsedResponse)
  //   return parsedResponse
  // }

  login = (username, password) => {
    const user = {user: {username: username, password: password}}

    fetch(`${BASE_URL}/login`, {method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
    })
    .then(response => {
      response.json().then(responseBody=>{
        if (response.ok) {
          const token = responseBody.token
          localStorage.setItem('token', `Bearer ${token}`)
          this.setState({loggedin: true})
          this.refreshCredentials()
          .catch(error => console.log('Credential Refresh Error', error));
        }
        else {
          console.log('Could not log in.', responseBody.message)
        }
      })
    })
  }

  logout = () => {
    localStorage.removeItem('token')
    this.setState({loggedin: false})
  }

  signup = (username, password) => {
    const user = {user: {username: username, password: password}}

    fetch(`${BASE_URL}/users`, {method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
    })
    .then(response => {
      response.json().then(responseBody=>{
        if (response.ok) {
          fetch(`${BASE_URL}/login`, {method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
          })
          .then(loginResponse => {
            loginResponse.json().then(loginResponseBody=>{
              if (loginResponse.ok) {
                const token = loginResponseBody.token
                localStorage.setItem('token', `Bearer ${token}`)
                this.setState({loggedin: true})
                this.refreshCredentials()
                .catch(error => console.log('Credential Refresh Error', error));
              }
              else {
                console.log('Could not log in.', loginResponseBody.message)
              }
            })
          })
        }
        else {
          console.log('Could not sign up user.', responseBody.message)
        }
      })
    })   
  }

  setLoginSignup = (desiredState) => {
    this.setState({loginSignup : desiredState})
  }

  setEditRead = (desiredState) => {
    this.setState({editRead: desiredState})
  }

  setSearchAnalyze = (desiredState) => {
    this.setState({searchAnalyze: desiredState})
  }

  executeLoginSignup = (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    let loginSignup = this.state.loginSignup
    
    if(loginSignup === "login") {
      this.login(username, password)
    }
    else {
      if (username === password) {
        console.log('User name and password cannot be the same.')
      }
      else {
        this.signup(username, password)
      }
    }
  }

  componentDidMount() {
    const loggedin = this.state.loggedin

    if(loggedin) {
      this.refreshCredentials()
      .catch(error => console.log('Credential Refresh Error', error));
    }
  }

  render () {
    const loggedin = this.state.loggedin

    return (
      <div className="App">
        <header className="App-header">
          {loggedin ?
            <LoggedInHeader logout={this.logout}/> :
            <LoginSignupHeader loginSignup={this.state.loginSignup} executeLoginSignup={this.executeLoginSignup} setLoginSignup={this.setLoginSignup}/>
          }
        </header>
        {loggedin ? 
          <div className="App-body">
            <Entry editRead={this.state.editRead} setEditRead={this.setEditRead}/>
            <Tools searchAnalyze={this.state.searchAnalyze} setSearchAnalyze={this.setSearchAnalyze}/>
          </div> : null}
      </div>
    )
  }
}

export default App;
