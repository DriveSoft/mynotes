import React, { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Filesbar from "./components/Filesbar/Filesbar"
import Searchbar from "./components/Searchbar"
import Profilebar from "./components/Profilebar"
import EditorTabs from "./components/EditorTabs"
import TextEditor from "./components/TextEditor"
import uuid from 'react-uuid';
import { files, ButtonId, sidebarButton } from "./types"
import { sortFiles } from "./utils"

const defaultFiles: files = {
	[uuid()]: "index.html",
	[uuid()]: "style.css",
	[uuid()]: "logo.svg"
}

function App() {
	const [activeSidebarButton, setActiveSidebarButton] = useState<ButtonId>("FILES");

	const [fileList, setFileList] = useState(defaultFiles);
	const [activeFile, setActiveFile] = useState<string | undefined>(Object.keys(defaultFiles)[0]);
	const [tabs, setTabs] = useState([Object.keys(defaultFiles)[0]]);

	useEffect(() => {
		setFileList(sortFiles(fileList));
	}, [])

	useEffect(() => {
		if (!activeFile) return
		if (!tabs.includes(activeFile)) {
			setTabs([...tabs, activeFile]);
		}
	}, [activeFile])

	useEffect(() => {

	}, [fileList])

	return (
		<div className="wrapper">
			<Sidebar
				activeButton={activeSidebarButton}
				setActiveSidebarButton={setActiveSidebarButton}
			/>

		
			{activeSidebarButton === 'FILES' && <Filesbar
				title="Dmitriy's notes"
				fileList={fileList}
				setFileList={setFileList}
				activeFile={activeFile}
				setActiveFile={setActiveFile}
			/>} 
			
			
			{activeSidebarButton === 'SEARCH' && <Searchbar />}		

			{activeSidebarButton === 'PROFILE' && <Profilebar />}	
					

			<div className="editorWrapper">
				<EditorTabs
					fileList={fileList}
					activeFile={activeFile}
					setActiveFile={setActiveFile}
					tabs={tabs}
					setTabs={setTabs}
				/>
				<TextEditor tabs={tabs} activeFile={activeFile} />
			</div>
		</div>
	);
}

export default App;
