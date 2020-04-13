import React from 'react'
import ToolsModeSelect from './ToolsModeSelect'

export default function SearchControls({setSearchAnalyze}) {
    return (
        <div className="controls search-controls">
            <ToolsModeSelect setSearchAnalyze={setSearchAnalyze}/>
            <input id="searchText" className="input" type="text" placeholder="Search..."></input>
            <i className="icon-cross_mark icon3x"></i>	
        </div>
    )
}
