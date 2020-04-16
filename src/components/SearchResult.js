import React from 'react'

export default function SearchResult (
        {
            editRead,
            searchResult,
            selectSearchResult
        }
    ) {

    return (
        <>
            {editRead === 'read' ? 
            <div className={`search-result ${searchResult.selected ? "selected-result" : ""}`} onClick={() => selectSearchResult(searchResult.entryID, searchResult.resultID)}>
                <div className="search-result-date">{searchResult.entryDate}</div>
                <div className="search-result-excerpt">{searchResult.excerpt}</div>
            </div> :
            <div className={`search-result ${searchResult.selected ? "selected-result" : ""}`}>
                <div className="search-result-date">{searchResult.entryDate}</div>
                <div className="search-result-excerpt">{searchResult.excerpt}</div>
            </div>}
        </>
    )
}
