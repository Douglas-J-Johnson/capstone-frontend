import React from 'react'
import EntryModeSelect from './EntryModeSelect'

export default function ReadControls({setEditRead}) {
    return (
    <div className="controls read-controls">
        <EntryModeSelect setEditRead={setEditRead}/>
        <i className="icon-arrow_big_left"></i>
        <div className="controls-text">January 1, 1900</div>
        <i className="icon-arrow_big_right"></i>
        <i className="icon-trash_can icon3x"></i>
      </div>
    )
}
