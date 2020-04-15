import React from 'react'

export default function EditPage({entry, editEntryDate, editEntryText}) {
    return (
        <div className="page">
          {entry.dateIsValid ?
            <input
            className="entry-date"
            type="text" value={entry.date}
            onChange={editEntryDate}
          ></input> :
          <input
            className="entry-date invalid"
            type="text" value={entry.date}
            onChange={editEntryDate}
          ></input>}
          <textarea
            className="entry-text"
            placeholder="Start recording or typing to record your thoughts."
            value={entry.text}
            onChange={editEntryText}
          ></textarea>
        </div>
    )
}
