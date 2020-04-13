import React from 'react'
import SearchControls from './SearchControls'
import AnalyzeControls from './AnalyzeControls'

export default function Tools({searchAnalyze, setSearchAnalyze}) {
    return (
        <div className="tools">
          {searchAnalyze === 'search' ?
            <SearchControls setSearchAnalyze={setSearchAnalyze}/> :
            <AnalyzeControls setSearchAnalyze={setSearchAnalyze}/>
          }
        </div>
    )
}
