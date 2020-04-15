import React from 'react';
import LoginSignupHeader from './components/LoginSignupHeader'
import LoggedInHeader from './components/LoggedInHeader'
import Entry from './components/Entry'
import Tools from './components/Tools'
import './App.css';

let moment = require('moment')
const earliestDate = 'January 1, 1900'
const earliestDateInt = moment(earliestDate).valueOf()
const latestDate = 'December 31, 2099'
const latestDateInt = moment(latestDate).valueOf()

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
      searchAnalyze: 'search',
      recording: false,
      analyzing: false,
      credentialsRefreshTime: 0,
      credentials: {
        stt : {url: '', token: ''},
        pi : {url: '', token: ''},
        ta : {url: '', token: ''},
        nlu : {url: '', token: ''},
      },
      entries: [],
      readEntryIndex: 0,
      entry: {
        id: null,
        date: moment().format("MMMM D[,] YYYY"),
        dateIsValid: true,
        text: ""
      },
      searchText: "",
      loginMessage: "",
      loginError: "",
      editMessage: "",
      editError: ""
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
  
    let tokens = await Promise.all([stt, pi, ta, nlu]);
  
    credentials.stt.token = `${tokens[0].iam_token}`;
    credentials.pi.token = `Bearer ${tokens[1].iam_token}`;
    credentials.ta.token = `Bearer ${tokens[2].iam_token}`;
    credentials.nlu.token = `Bearer ${tokens[3].iam_token}`;
    credentials.stt.url = tokens[0].api_url;
    credentials.pi.url = `${tokens[1].api_url}${PI_ENDPOINT}?version=${PI_VERSION}`;
    credentials.ta.url = `${tokens[2].api_url}${TA_ENDPOINT}?version=${TA_VERSION}`;
    credentials.nlu.url = `${tokens[3].api_url}${NLU_ENDPOINT}?version=${NLU_VERSION}`;
  
    this.setState({credentials, credentialsRefreshTime});
  }

  uint8ArrayToString = (uint8Arr) => {
    return String.fromCharCode.apply(null, uint8Arr);
  }

  eventDataReceived = (data) => {
    let entry = Object.assign({}, this.state.entry)
    let entryText = entry.text

    entryText = entryText.concat(this.uint8ArrayToString(data))
    entry.text = entryText

    this.setState({entry})
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
    .then(this.analyzeText(entryText))
  }

  analyzeText = async function (textToAnalyze) {
    const credentials = this.state.credentials

    let ta = this.getToneAnalysis(
      credentials.ta.url,
      credentials.ta.token,
      textToAnalyze
    )
    let pi = this.getPersonalityInsights(
      credentials.pi.url,
      credentials.pi.token,
      textToAnalyze
    )
    /*let nlu = getNaturalLanguageUnderstanding(
      credentials.nlu.url,
      credentials.nlu.token,
      textToAnalyze
    )*/
  
    let analyses = await Promise.all([ta, pi])
    return {tone_analyzer: analyses[0], personailty_insights: analyses[1]}
  }

  getToneAnalysis = async function (serviceURL, serviceToken, textToAnalyze) {
    //console.log(serviceToken)
    console.log('Tone Analysis', serviceURL)
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
    //console.log(serviceToken)
    console.log('Personality Insights', serviceURL)
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
          this.setState({loginMessage: `Welcome, ${username}!`, loginError: ''})
          this.refreshCredentials()
          .then(
            fetch(`${BASE_URL}/entries`, {
            headers: {
              'Accept': 'application/json',
              'Authorization' : localStorage.getItem('token')
            }})
            .then(entriesResponse => {
              entriesResponse.json().then(entriesResponseBody=>{
                if(entriesResponse.ok) {
                  const entries = entriesResponseBody.entries.sort((a, b) => a.date - b.date)
                  this.setState({entries: entries})
                }
              })
            })
          )
          .catch(error => console.log('Credential Refresh Error', error));
        }
        else {
          this.setState({loginMessage: '', loginError: 'Unable to log in.'})
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
                this.setState({loginMessages: `Welcome, ${username}!`})
                this.refreshCredentials()
                .catch(error => console.log('Credential Refresh Error', error));
              }
              else {
                this.setState({loginMessage: '', loginError: 'Unable to log in.'})
              }
            })
          })
        }
        else {
          this.setState({loginMessage: '', loginError: 'Unable to sign up.'})
        }
      })
    })   
  }

  setLoginSignup = (desiredState) => {
    

    this.setState({
      loginSignup: desiredState,
      loginMessage: '',
      loginError: ''
    })
  }

  setEntry = (index) => {
    const entries = this.state.entries
    const selectedEntry = entries[index]

    const entry = {
      id: selectedEntry.id,
      date: moment(parseInt(selectedEntry.date)).format("MMMM D[,] YYYY"),
      dateIsValid: true,
      text: selectedEntry.text
    }

    this.setState({entry: entry, readEntryIndex: index})
  }

  entryByEntryId = (entryID) => {
    const entries = this.state.entries
    const numberOfEntries = this.state.entries.length
    let entryIndex = 0

    for(let i = 0; i < numberOfEntries; i++) {
      if (entries[i].id === entryID) {
        entryIndex = i
      }
    }

    this.setEntry(entryIndex)
  }

  newestEntry = () => {
    const numberOfEntries = this.state.entries.length

    this.setEntry(numberOfEntries - 1)
  }

  nextEntry = () => {
    const currentReadEntryIndex = this.state.readEntryIndex
    const numberOfEntries = this.state.entries.length

    if (currentReadEntryIndex < (numberOfEntries - 1))
    {
      this.setEntry(currentReadEntryIndex + 1)
    }
  }

  previousEntry = () => {
    const currentReadEntryIndex = this.state.readEntryIndex

    if (currentReadEntryIndex > 0)
    {
      this.setEntry(currentReadEntryIndex - 1)
    }
  }

  setEditRead = (desiredState) => {
    let currentEntry = Object.assign({}, this.state.entry)

    if(desiredState === 'read') {
      if (currentEntry.id === null) {
        this.newestEntry()
      }
      else {
        // change
      }
    }
    else if (desiredState === 'edit') {
      // change?
    }
    else if (desiredState === 'new') {
      const entry = {
        id: null,
        date: moment().format("MMMM D[,] YYYY"),
        dateIsValid: true,
        text: ""
      }

      desiredState = 'edit'
      this.setState({entry})
    }

    console.log('Desired State', desiredState)
    this.setState({editRead: desiredState})
  }

  setSearchAnalyze = (desiredState) => {
    this.setState({searchAnalyze: desiredState})
  }

  executeSearch = () => {
    const searchText = this.state.searchText

    // Call B/E record search
  }

  customCheckDateIsValid = (date) => {
    if(moment(date).isValid() && moment(date).valueOf() >= earliestDateInt && moment(date).valueOf() <= latestDateInt) {
      return true
    }
    else {
      return false
    }
  }

  editEntryDate = (event) => {
    let entry = Object.assign({}, this.state.entry)
    const entryDate = event.target.value
    
    entry.date = entryDate

    if(this.customCheckDateIsValid(entryDate)) {
      this.setState({loginError: ''})
      entry.dateIsValid = true
    }
    else {
      this.setState({loginError: 'Correct date before submitting your entry.'})
      entry.dateIsValid = false
    }

    this.setState({entry})
  }

  editEntryText = (event) => {
    let entry = Object.assign({}, this.state.entry)
    const entryText = event.target.value
    entry.text = entryText

    this.setState({entry})
  }

  clearEntryText = () => {
    let entry = Object.assign({}, this.state.entry)
    entry.text = ""

    this.setState({entry})
  }

  createEntry = () => {
    const entry = this.state.entry

    let newEntry = {
      id: null,
      date: moment(entry.date).valueOf(),
      dateIsValid: entry.dateIsValid,
      text: entry.text
    }

    if (!entry.dateIsValid) {
      return
    }

    if (entry.id) {
      // Call analyze
      // UPDATE!!!!!
      // fetch(`${BASE_URL}/`)
      // if successful
      // else
      // Retrieve Entries
      // fetch(`${BASE_URL}/entries`, {
      //   headers: {
      //     'Accept': 'application/json',
      //     'Authorization' : localStorage.getItem('token')
      //   }})
      //   .then(entriesResponse => {
      //     entriesResponse.json().then(entriesResponseBody=>{
      //       if(response.ok) {
      //         const entries = entriesResponseBody.entries.sort((a, b) => a.date - b.date)
      //         this.setState({entries})
      //       }
      //     })
      //   })
    }
    else {
      // CREATE!!!!!
      fetch(`${BASE_URL}/entries`,{method: "POST",
          headers: {
            'Accept': 'application/json',
            'Authorization' : localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({entry: newEntry})
        }
      )
      .then(createResponse =>{
        createResponse.json().then(response => {
          if(createResponse.ok) {
            newEntry.id = response.entry.id
            newEntry.date = moment(newEntry.date).format("MMMM D[,] YYYY")
            this.setState({newEntry})

            this.analyzeText(newEntry.text)
            .then(analyses => {
              fetch(`${BASE_URL}/analyses`,{method: "POST",
                  headers: {
                    'Accept': 'application/json',
                    'Authorization' : localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({analysis: {entry_id: newEntry.id, raw_results: analyses}})
                }
              )
              .then(analysisCreateResponse =>{
                analysisCreateResponse.json().then(analysisResponse => {
                  if(analysisCreateResponse.ok) {
                    fetch(`${BASE_URL}/entries`, {
                      headers: {
                        'Accept': 'application/json',
                        'Authorization' : localStorage.getItem('token')
                      }
                    })
                    .then(entriesResponse => {
                      entriesResponse.json().then(entriesResponseBody=>{
                        if(entriesResponse.ok) {
                          const entries = entriesResponseBody.entries.sort((a, b) => a.date - b.date)
                          this.setState({entries: entries})
                          this.entryByEntryId(newEntry.id)
                        }
                        else {
                          console.log("Error retrieving all entries.", response)
                        }
                      })
                    })
                  }
                  else {
                    console.log("Analysis creation error.", response)
                  }
                })
              })
            })
            .catch(error => console.log('Credential Refresh Error', error));
          }
          else {
            console.log("Entry creation error.", response)
          }
        })
      })
    }
  }

  DeleteEntry = () => {
    /* fetch(`${BASE_URL}/analyses/${analysis.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization' : localStorage.getItem('token')
      }
    })
    .then(analysisResponse => {
      if(analysisResponse.ok) {
        fetch(`${BASE_URL}/analyses/${analysis.id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Authorization' : localStorage.getItem('token')
          }
        })
        .then(entryResponse => {
          if(entryReponse.ok) {
            //update state
          }
        })
      }
    })*/
  }

  editSearchText = (event) => {
    const searchText = event.target.value

    this.setState({searchText})    
  }

  clearSearchText = () => {
    this.setState({searchText: ''})
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
        this.setState({loginMessage: '', loginError: 'User name and password cannot be the same.'})
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

      fetch(`${BASE_URL}/entries`, {
        headers: {
          'Accept': 'application/json',
          'Authorization' : localStorage.getItem('token')
        }
      })
      .then(entriesResponse => {
        entriesResponse.json().then(entriesResponseBody=>{
          if(entriesResponse.ok) {
            const entries = entriesResponseBody.entries.sort((a, b) => a.date - b.date)
            this.setState({entries: entries})
          }
        })
      })
    }
  }

  render () {
    const loggedin = this.state.loggedin
    const loginError = this.state.loginError
    const loginMessage = this.state.loginMessage
    const editError = this.state.editError
    const editMessage = this.state.editMessage

    return (
      <div className="App">
        <header className="App-header">
          {loggedin ?
            <LoggedInHeader 
              loginError={loginError}
              loginMessage={loginMessage}
              editError={editError}
              editMessage={editMessage}
              logout={this.logout}/> :
            <LoginSignupHeader
              loginError={loginError}
              loginMessage={loginMessage}
              editError={editError}
              editMessage={editMessage}
              loginSignup={this.state.loginSignup}
              executeLoginSignup={this.executeLoginSignup}
              setLoginSignup={this.setLoginSignup}
            />
          }
        </header>
        {loggedin ? 
          <div className="App-body">
            <Entry
              entry = {this.state.entry}
              editRead={this.state.editRead}
              setEditRead={this.setEditRead}
              previousEntry={this.previousEntry}
              nextEntry={this.nextEntry}
              recording={this.state.recording}
              startRecording={this.startRecording}
              stopRecording={this.stopRecording}
              editEntryDate={this.editEntryDate}
              editEntryText={this.editEntryText}
              clearEntryText={this.clearEntryText}
              createEntry={this.createEntry}
            />
            <Tools
              searchAnalyze={this.state.searchAnalyze}
              setSearchAnalyze={this.setSearchAnalyze}
              searchText={this.state.searchText}
              editSearchText={this.editSearchText} 
              executeSearch={this.executeSearch}
              clearSearchText={this.clearSearchText}
            />
          </div> : null}
      </div>
    )
  }
}

export default App;
