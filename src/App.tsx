import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Filesbar from "./components/Filesbar/Filesbar";
import Searchbar from "./components/Searchbar";
import Profilebar from "./components/Profilebar";
import EditorTabs from "./components/EditorTabs";
import TextEditor from "./components/TextEditor";
import { files, tabs, ButtonId } from "./types";
import { sortFiles, updateFilenameAPI, URL_API } from "./utils";

// const defaultFiles: files[] = [
// 	{
// 		id: uuid(),
// 		fileName: "index.html",
// 		content: ""
// 	},
// 	{
// 		id: uuid(),
// 		fileName: "style.css",
// 		content: ""
// 	},
// 	{
// 		id: uuid(),
// 		fileName: "logo.svg",
// 		content: ""
// 	},		
// ]

function App() {
	const [activeSidebarButton, setActiveSidebarButton] = useState<ButtonId>("FILES");

	const [fileList, setFileList] = useState<files[]>([]);
	const [activeFile, setActiveFile] = useState<string | undefined>(undefined);
	const [tabs, setTabs] = useState<tabs[]>([]);
	
	const [widthSidebar, setWidthSidebar] = useState(260)
	const [dragSizeSidebar, setDragSizeSidebar] = useState({draggable: false, xMouseStart: 0, initPosX: 0})


	useEffect(() => {
		const fetchData = async() => {
			const response = await fetch(URL_API)
			const data = await response.json()
			setFileList(sortFiles(data))
		}

		fetchData()
	}, [])

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {			 
			if(e.ctrlKey && e.code === 'KeyS') {				
				e.preventDefault()
				activeFile && saveFile(activeFile)
			}
		}

		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [activeFile, fileList])	


	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			let width = dragSizeSidebar.initPosX + e.pageX - dragSizeSidebar.xMouseStart
			width > 150 && setWidthSidebar(width)
		}

		const onMouseUp = (e: MouseEvent) => {
			setDragSizeSidebar({draggable: false, xMouseStart: 0, initPosX: 0})
		}		

        dragSizeSidebar.draggable && document.addEventListener('mousemove', onMouseMove)
		dragSizeSidebar.draggable && document.addEventListener('mouseup', onMouseUp)

		return () => {
			document.removeEventListener('mousemove', onMouseMove)
			document.removeEventListener('mouseup', onMouseUp)
		}
        
	}, [dragSizeSidebar])

	useEffect(() => {
		if (!activeFile) return;
		if (!tabs.find(tabItem => tabItem.id === activeFile)) {
			setTabs([...tabs, {id: activeFile, saved: true}]);
		}		
	}, [activeFile]);

	const fileIdToObject = (fileId: string) => {
		return fileList.find(file => file.id === fileId)
	}

	const saveFile = async (idFile: string) => {
		const fileObj = fileIdToObject(idFile)
		if(fileObj) {
			if(await updateFilenameAPI(fileObj.id, fileObj.fileName, fileObj.content)) {
				const newTabs = tabs.map(tab => tab.id === idFile ? {...tab, saved: true} : tab)
				setTabs(newTabs)
			}
		}
	}

	return (
		<div className="wrapper">
			<Sidebar
				activeButton={activeSidebarButton}
				setActiveSidebarButton={setActiveSidebarButton}
			/>

			<div className="sidebar2" style={{width: widthSidebar}}>
				{activeSidebarButton === "FILES" && (
					<Filesbar
						title="Dmitriy's notes"
						fileList={fileList}
						setFileList={setFileList}
						activeFile={activeFile}
						setActiveFile={setActiveFile}						
					/>
				)}

				{activeSidebarButton === "SEARCH" && <Searchbar />}

				{activeSidebarButton === "PROFILE" && <Profilebar />}
			</div>			

			<div
				className="dragBar"
				onMouseDown={(e) => setDragSizeSidebar({draggable: true, xMouseStart: e.pageX, initPosX: widthSidebar})}
				onMouseUp={(e) => console.log(e.clientY)}

			></div>

			<div className="editorWrapper">
				<EditorTabs
					fileList={fileList}
					activeFile={activeFile}
					setActiveFile={setActiveFile}
					tabs={tabs}
					setTabs={setTabs}
				/>
				<TextEditor tabs={tabs} setTabs={setTabs} filesList={fileList} setFileList={setFileList} activeFile={activeFile} />
			</div>
		</div>
	);
}

export default App;
