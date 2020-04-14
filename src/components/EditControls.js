import React from 'react'
import EntryModeSelect from './EntryModeSelect'

export default function EditControls({setEditRead, recording, startRecording, stopRecording, clearEntryText}) {
    return (
        <div className="controls edit-controls">
            <EntryModeSelect setEditRead={setEditRead}/>
            <div className="record-controls">
                {recording ? 
                    <i className="icon-mute_off icon2x"></i> :
                    <i className="icon-mute_off icon2x" onClick={startRecording}></i>
                }    
                {recording ?
                    <i className="icon-mute_on icon2x" onClick={stopRecording}></i> :
                    <i className="icon-mute_on icon2x"></i>
                }
            </div>
            <div className="controls">
                <i className="icon-check icon3x"></i>
                {recording ?
                    <i className="icon-trash_can warn icon3x"></i> :
                    <i className="icon-trash_can warn icon3x" onClick={clearEntryText}></i>
                }
            </div>
      </div>
    )
}
