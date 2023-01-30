import React from "react";
import { files } from "../types";

interface EditorTabsProps {
	fileList: files;
	activeFile: string | undefined;
	setActiveFile: (value: string | undefined) => void;
	tabs: string[];
	setTabs: (value: string[]) => void;
}

function EditorTabs({ fileList, activeFile, setActiveFile, tabs, setTabs }: EditorTabsProps) {
	
	const onCloseButton = (e: React.MouseEvent<HTMLElement>, fileToClose: string) => {
		e.stopPropagation(); 
		setTabs(tabs.filter(fileForClose => fileForClose !== fileToClose))
		if (activeFile === fileToClose) setActiveFile(undefined);
	}

	return (
		<div className="editorTabs">
			{
				tabs.map((fileId: string) => (
					<div key={fileId} className={activeFile === fileId ? "tab activeTab" : "tab" } onClick={()=>setActiveFile(fileId)} >
						<i className="tabIcon fa-regular fa-file-lines"></i>
						<p className="tabFilename">{fileList[fileId]}</p>
					<p className="tabCloseButton" onClick={ (e) => onCloseButton(e, fileId) }>⨉</p>
				</div>					
				))
			}
		</div>
	);
}

export default EditorTabs;
