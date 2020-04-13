import React from 'react'

export default function LoginSignupHeader({loginSignup, executeLoginSignup, setLoginSignup}) {
    return (
        <>
          {loginSignup === 'login' ?
            <i className="icon-user_male selected icon3x"></i> :
            <i className="icon-user_male icon3x" onClick={() => setLoginSignup('login')}></i>
          }
          {loginSignup === 'signup' ?
            <i className="icon-new_user selected icon3x"></i> :
            <i className="icon-new_user icon3x" onClick={() => setLoginSignup('signup')}></i>
          }
          <form className="username-password" onSubmit={executeLoginSignup}>
            <input id="username" className="input" type="text" placeholder="Username"></input>
            <input id="password" className="input" type="password" placeholder="Password"></input>
            <input id="username-password-submit" className='login-signin-logout-button' type="submit" value={loginSignup === 'signup' ? "Sign Up" : "Log In"}/>
          </form>
        </>
    )
}
