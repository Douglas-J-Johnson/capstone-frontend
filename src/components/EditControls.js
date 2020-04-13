import React from 'react'
import EntryModeSelect from './EntryModeSelect'

export default function EditControls({setEditRead}) {
    return (
        <div className="controls edit-controls">
            <EntryModeSelect setEditRead={setEditRead}/>
            <i className="icon-mute_off icon2x"></i>
            <i className="icon-mute_on icon2x"></i>
            <i className="icon-check icon2x"></i>
            <i className="icon-trash_can icon3x"></i>
      </div>
    )
}
