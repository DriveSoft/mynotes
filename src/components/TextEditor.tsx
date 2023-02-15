import React from "react";
import { files, tabs } from "../types";
import {getFileById} from "../utils"
import "./TextEditor.css";

interface TextEditorProps {
	tabs: tabs[];
	setTabs: (value: tabs[]) => void;
	filesList: files[];
	setFileList: (value: files[]) => void;
	activeFile: number | undefined;
}

function TextEditor({ filesList, setFileList, tabs, setTabs, activeFile }: TextEditorProps) {

	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>, fileId: number) => {					
		// const newFileList = filesList.map((file: files) => {
		// 	if(file.id === fileId) {
		// 		return {...file, content: e.target.value} 
		// 	} else {
		// 		return file
		// 	}
		// })

		const newTabList = tabs.map((fileTab: tabs) => {
			if(fileTab.id === fileId) {
				return {...fileTab, saved: false, content: e.target.value} 
			} else {
				return fileTab
			}
		})		

		setTabs(newTabList)
		//setFileList(newFileList)
	}

	return (
		<div className="mainEditor">
			{tabs.map((tabFile) => (
				<textarea
					key={tabFile.id}
					name="note"
					style={{
						display: tabFile.id === activeFile ? "block" : "none",
					}}
					//value={getFileById(filesList, tabFile.id)?.content}
					value={tabFile.content}
					onChange={e => onChange(e, tabFile.id)}

				></textarea>
			))}
		</div>
	);
}

export default TextEditor;
