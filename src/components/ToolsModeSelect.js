import React from 'react'

export default function ToolsModeSelect({setSearchAnalyze}) {
    return (
        <div className="controls">
            <i className="icon-magnifying icon3x" onClick={() => setSearchAnalyze('search')}></i>
            <i className="icon-chart icon3x" onClick={() => setSearchAnalyze('analyze')}></i>            
        </div>
    )
}
