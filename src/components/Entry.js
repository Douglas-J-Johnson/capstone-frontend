import React from 'react'
import ReadControls from './ReadControls'
import EditControls from './EditControls'
import Moment from 'react-moment'

export default function Entry(
  {entry, 
  editRead,
  setEditRead,
  recording,
  startRecording,
  stopRecording,
  editEntryText,
  clearEntryText}
  ) {
  return (
      <div className="entry">
        {editRead === 'edit' ?
          <EditControls
            setEditRead={setEditRead}
            recording={recording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            clearEntryText={clearEntryText}
          /> :
          <ReadControls setEditRead={setEditRead}/>
        }
        <div className="page">
          {entry.date > 0 ?
            <h2>
              <Moment format="dddd MMMM D[,] YYYY">
                {entry.date}
              </Moment>
            </h2>:
            null
            }
          <textarea
            className="entry-text"
            value={entry.text}
            onChange={editEntryText}
          ></textarea>
        </div>
      </div>
  )
}
