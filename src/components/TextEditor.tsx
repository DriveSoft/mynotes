import React from "react";
import { tabs } from "../types";
import "./TextEditor.css";

interface TextEditorProps {
	tabs: tabs[];
	setTabs: (value: tabs[]) => void;
	activeFile: number | undefined;
}

function TextEditor({ tabs, setTabs, activeFile }: TextEditorProps) {

	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>, fileId: number) => {					

		const newTabList = tabs.map((fileTab: tabs) => {
			if(fileTab.id === fileId) {
				return {...fileTab, saved: false, content: e.target.value} 
			} else {
				return fileTab
			}
		})		

		setTabs(newTabList)
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
					value={tabFile.content}
					onChange={e => onChange(e, tabFile.id)}

				></textarea>
			))}
		</div>
	);
}

export default TextEditor;
