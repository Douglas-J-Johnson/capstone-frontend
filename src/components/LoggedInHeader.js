import React from 'react'

export default function LoggedInHeader({logout}) {
    return (
        <>
            <input type="button" className='login-signin-logout-button' onClick={logout} value="Log Out"/> :
        </>
    )
}
