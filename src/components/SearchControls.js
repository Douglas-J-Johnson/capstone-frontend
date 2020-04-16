import React from 'react'
import ToolsModeSelect from './ToolsModeSelect'

export default function SearchControls(
    {
        searchAnalyze,
        setSearchAnalyze,
        searchText,
        editSearchText,
        executeSearch, 
        clearSearchText
    }
    ) {
    return (
        <div className="controls search-controls">
            <ToolsModeSelect
                searchAnalyze={searchAnalyze}
                setSearchAnalyze={setSearchAnalyze}
            />
            <div className="controls">
                <input
                    id="searchText"
                    className="input"
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={editSearchText}
                ></input>
                {searchText !== "" ?
                    <i className="icon-chevron_right icon3x" onClick={executeSearch}></i> :
                    <i className="icon-chevron_right icon3x"></i>
                }
                {searchText !== "" ?
                    <i className="icon-cross_mark icon3x" onClick={clearSearchText}></i> :
                    <i className="icon-cross_mark icon3x"></i>
                }
            </div>
        </div>
    )
}
