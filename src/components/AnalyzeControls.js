import React from 'react'
import ToolsModeSelect from './ToolsModeSelect'

export default function AnalyzeControls({setSearchAnalyze}) {
    return (
        <div className="controls analyze-controls">
            <ToolsModeSelect setSearchAnalyze={setSearchAnalyze}/>
            <div className="controls-text"></div>
        </div>
    )
}
