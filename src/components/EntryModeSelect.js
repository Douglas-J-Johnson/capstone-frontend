import React from 'react'

export default function EntryModeSelect({editRead, setEditRead}) {
    return (
        <div className="controls">
            {editRead === 'read' ?
                <i className="icon-reorder icon3x selected"></i> :           
                <i className="icon-reorder icon3x" onClick={() => setEditRead('read')}></i>            
            }
            {editRead === 'edit' ?
                <i className="icon-vector_pen icon3x selected"></i> :
                <i className="icon-vector_pen icon3x" onClick={() => setEditRead('edit')}></i>
            }
            <i className="icon-plus icon3x" onClick={() => setEditRead('new')}></i>
        </div>
    )
}
