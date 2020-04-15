import React from 'react'

export default function ToolsModeSelect(
    {
        searchAnalyze,
        setSearchAnalyze
    }
    ) {
    return (
        <div className="controls">
            {searchAnalyze === 'search' ?
                <i className="icon-magnifying icon3x selected"></i> :
                <i className="icon-magnifying icon3x" onClick={() => setSearchAnalyze('search')}></i>
            }
            {searchAnalyze === 'analyze' ?
                <i className="icon-chart icon3x selected"></i> :
                <i className="icon-chart icon3x" onClick={() => setSearchAnalyze('analyze')}></i>
            }
        </div>
    )
}