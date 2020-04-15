import React from 'react'
import ToolsModeSelect from './ToolsModeSelect'

export default function AnalyzeControls(
    {
        searchAnalyze,
        setSearchAnalyze
    }) {
    return (
        <div className="controls analyze-controls">
            <ToolsModeSelect
                searchAnalyze={searchAnalyze}
                setSearchAnalyze={setSearchAnalyze}
            />
            <div className="controls-text"></div>
        </div>
    )
}
