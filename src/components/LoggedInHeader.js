import React from 'react'

export default function LoggedInHeader(
    {
        loginError,
        loginMessage,
        editError,
        editMessage,
        logout
    }
    ) {
    return (
        <>
            {loginError !== "" ? <div className='login-signin-logout-text warn'>{loginError}</div> : null}
            {loginMessage !== "" ? <div className='login-signin-logout-text'>{loginMessage}</div> : null}
            {editError !== "" ? <div className='login-signin-logout-text warn'>{editError}</div> : null}
            {editMessage !== "" ? <div className='login-signin-logout-text'>{editMessage}</div> : null}
            <input type="button" className='login-signin-logout-button' onClick={logout} value="Log Out"/>
        </>
    )
}
