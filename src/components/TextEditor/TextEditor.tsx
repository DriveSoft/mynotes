import React from "react";
import { tabs } from "../../types";
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
				<React.Fragment key={tabFile.id}>				
				{
					tabFile.isLoading ? 
						<div className="wrapperLoading">
							<div className="lds-dual-ring"></div>
						</div>
						
					:
					<textarea						
						name="note"
						style={{
							display: tabFile.id === activeFile ? "block" : "none",
						}}
						value={tabFile.content}
						onChange={e => onChange(e, tabFile.id)}
					></textarea>				
				}				
				</React.Fragment>
			))}
		</div>
	);
}

export default TextEditor;
