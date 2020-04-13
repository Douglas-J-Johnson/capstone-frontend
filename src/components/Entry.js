import React from 'react'
import ReadControls from './ReadControls'
import EditControls from './EditControls'

export default function Entry({editRead, setEditRead}) {
    return (
        <div className="entry">
          {editRead === 'edit' ?
            <EditControls setEditRead={setEditRead}/> :
            <ReadControls setEditRead={setEditRead}/>
          }
          <div className="page">
          </div>
        </div>
    )
}
