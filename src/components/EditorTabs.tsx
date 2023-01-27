import React, { useState } from "react";

interface EditorTabsProps {
	files: string[];
	activeFile: string | undefined;
	setActiveFile: (value: string | undefined) => void;
	tabs: string[];
	setTabs: (value: string[]) => void;
}

function EditorTabs({ files, activeFile, setActiveFile, tabs, setTabs }: EditorTabsProps) {
	
	const onCloseButton = (e: React.MouseEvent<HTMLElement>, fileToClose: string) => {
		e.stopPropagation(); 
		setTabs(tabs.filter(fileForClose => fileForClose !== fileToClose))
		if (activeFile === fileToClose) setActiveFile(undefined);
	}

	return (
		<div className="editorTabs">
			{
				tabs.map((fileName: string) => (
					<div className={activeFile === fileName ? "tab activeTab" : "tab" } onClick={()=>setActiveFile(fileName)} >
						<i className="tabIcon fa-regular fa-file-lines"></i>
						<p className="tabFilename">{fileName}</p>
					<p className="tabCloseButton" onClick={ (e) => onCloseButton(e, fileName) }>⨉</p>
				</div>					
				))
			}
		</div>
	);
}

export default EditorTabs;
