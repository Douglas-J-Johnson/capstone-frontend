import React from 'react'
import SearchControls from './SearchControls'
import AnalyzeControls from './AnalyzeControls'
import SearchResult from "./SearchResult"

export default function Tools(
    {
      editRead,
      searchAnalyze,
      setSearchAnalyze,
      searchText,
      editSearchText,
      executeSearch, 
      clearSearchText,
      searchResults,
      selectSearchResult
    }
    ) {

    const searchResultComponents = () => {
      return searchResults.map(searchResult => 
        <SearchResult 
          key={searchResult.entryID} 
          editRead={editRead} 
          searchResult={searchResult} 
          selectSearchResult={selectSearchResult}
        />)
    }

    return (
      <div className="tools">
        {searchAnalyze === 'search' ?
          <SearchControls
            searchAnalyze={searchAnalyze}
            setSearchAnalyze={setSearchAnalyze}
            searchText={searchText}
            editSearchText={editSearchText}
            executeSearch={executeSearch}
            clearSearchText={clearSearchText}
          /> :
          <AnalyzeControls
            searchAnalyze={searchAnalyze}
            setSearchAnalyze={setSearchAnalyze}
          />
        }
        {searchAnalyze === 'search' ?
          searchResultComponents() :
          null
        }
      </div>
    )
}
