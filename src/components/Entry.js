import React from 'react'
import ReadControls from './ReadControls'
import EditControls from './EditControls'
import ReadPage from './ReadPage'
import EditPage from './EditPage'

export default function Entry(
  {
    entry, 
    editRead,
    setEditRead,
    previousEntry,
    nextEntry,
    recording,
    startRecording,
    stopRecording,
    editEntryDate,
    editEntryText,
    createEntry,
    clearEntryText,
    deleteEntry
  }
  ) {

  return (
      <div className="entry">
        {editRead === 'edit' || editRead === 'new' ?
          <EditControls
            editRead={editRead}
            setEditRead={setEditRead}
            recording={recording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            createEntry={createEntry}
            clearEntryText={clearEntryText}
          /> :
          <ReadControls
            entry={entry}
            editRead={editRead}
            setEditRead={setEditRead}
            previousEntry={previousEntry}
            nextEntry={nextEntry}
            deleteEntry={deleteEntry}
          />
        }
        {editRead === 'edit' || editRead === 'new' ?
          <EditPage
            entry={entry}
            editEntryText={editEntryText}
            editEntryDate={editEntryDate}
          /> :
          <ReadPage
            entry={entry} 
          />
        }
      </div>
  )
}
