import React from 'react'
import EntryModeSelect from './EntryModeSelect'

export default function ReadControls(
    {
        entry,
        editRead,
        setEditRead,
        previousEntry,
        nextEntry
    }) {
    return (
    <div className="controls read-controls">
        <EntryModeSelect
            editRead={editRead}
            setEditRead={setEditRead}
        />
        <div className="controls">
            <i className="icon-arrow_big_left" onClick={previousEntry}></i>
                <div className="controls-text">{entry.date}</div>
            <i className="icon-arrow_big_right" onClick={nextEntry}></i>
        </div>
      </div>
    )
}
