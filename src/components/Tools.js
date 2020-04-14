import React from 'react'
import SearchControls from './SearchControls'
import AnalyzeControls from './AnalyzeControls'

export default function Tools(
    {searchAnalyze,
    setSearchAnalyze,
    searchText,
    editSearchText,
    executeSearch, 
    clearSearchText}
    ) {
    return (
        <div className="tools">
          {searchAnalyze === 'search' ?
            <SearchControls
                setSearchAnalyze={setSearchAnalyze}
                searchText={searchText}
                editSearchText={editSearchText}
                executeSearch={executeSearch}
                clearSearchText={clearSearchText}
            /> :
            <AnalyzeControls setSearchAnalyze={setSearchAnalyze}/>
          }
        </div>
    )
}
