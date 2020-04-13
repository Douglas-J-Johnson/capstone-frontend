import React from 'react'

export default function EntryModeSelect({setEditRead}) {
    return (
        <div className="controls-mode-select">
            <i className="icon-vector_pen icon3x" onClick={() => setEditRead('edit')}></i>
            <i className="icon-reorder icon3x" onClick={() => setEditRead('read')}></i>            
        </div>
    )
}
