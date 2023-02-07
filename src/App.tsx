import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Filesbar from "./components/Filesbar/Filesbar";
import Searchbar from "./components/Searchbar";
import Profilebar from "./components/Profilebar";
import EditorTabs from "./components/EditorTabs";
import TextEditor from "./components/TextEditor";
import { files, tabs, ButtonId } from "./types";
import { sortFiles, URL_API } from "./utils";

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
		// if (!tabs.includes(activeFile)) {
		// 	setTabs([...tabs, activeFile]);
		// }
		if (!tabs.find(tabItem => tabItem.id === activeFile)) {
			setTabs([...tabs, {id: activeFile, saved: true}]);
		}		
	}, [activeFile]);


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
