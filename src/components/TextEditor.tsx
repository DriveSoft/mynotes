import React from "react";

interface TextEditorProps {
	tabs: string[];
	activeFile: string | undefined;
}

function TextEditor( {tabs, activeFile}: TextEditorProps  ) {
	return (
		<div className="mainEditor">			
			{
				tabs.map((tabFile) => (
					<textarea key={tabFile} name="note" style={{display: (tabFile === activeFile ? "block" : "none" ) }}></textarea>
				))
			}			
		</div>
	);
}

export default TextEditor;
