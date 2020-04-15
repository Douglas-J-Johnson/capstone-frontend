import React from 'react'

export default function ReadPage({entry}) {
    return (
        <div className="page">
            <div className="entry-text">{entry.text}</div>
        </div>
    )
}
