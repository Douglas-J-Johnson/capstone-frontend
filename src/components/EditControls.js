import React from 'react'
import EntryModeSelect from './EntryModeSelect'

export default function EditControls(
    {
        editRead,
        setEditRead,
        recording,
        startRecording,
        stopRecording,
        createEntry,
        clearEntryText
    }
    ) {

    return (
        <div className="controls edit-controls">
            <EntryModeSelect
                setEditRead={setEditRead}
                editRead={editRead}
            />
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
                {recording ?
                    <i className="icon-check icon3x"></i> :
                    <i className="icon-check icon3x" onClick={createEntry}></i>
                }
                {recording ?
                    <i className="icon-cross_mark warn icon3x"></i> :
                    <i className="icon-cross_mark warn icon3x" onClick={clearEntryText}></i>
                }
            </div>
      </div>
    )
}
