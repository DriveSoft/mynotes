import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./components/Sidebar";
import Filesbar from "./components/Filesbar/Filesbar";
import Searchbar from "./components/Searchbar";
import Profilebar from "./components/Profilebar";
import EditorTabs from "./components/EditorTabs";
import TextEditor from "./components/TextEditor";
import ModalDialog from "./components/ModalDialog";
import { files, tabs, ButtonId } from "./types";
import { sortFiles, updateFilenameAPI, URL_API } from "./utils";

import { AppContext, AppContextType } from './Context';


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

	const { 
		fileList, 
		setFileList, 

		activeFile, 
		setActiveFile,

		tabs,
		setTabs

	} = useContext(AppContext) as AppContextType;

	const [activeSidebarButton, setActiveSidebarButton] = useState<ButtonId>("FILES");
	const [widthSidebar, setWidthSidebar] = useState(260);
	const [dragSizeSidebar, setDragSizeSidebar] = useState({
		draggable: false,
		xMouseStart: 0,
		initPosX: 0,
	});

	const [showDlgSaveFile, setShowDlgSaveFile] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(URL_API);
			const data = await response.json();
			setFileList(sortFiles(data));
		};

		fetchData();
	}, []);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.code === "KeyS") {
				e.preventDefault();
				activeFile && saveFile(activeFile);
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [activeFile, fileList]);

	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			let width =
				dragSizeSidebar.initPosX +
				e.pageX -
				dragSizeSidebar.xMouseStart;
			width > 150 && setWidthSidebar(width);
		};

		const onMouseUp = (e: MouseEvent) => {
			setDragSizeSidebar({
				draggable: false,
				xMouseStart: 0,
				initPosX: 0,
			});
		};

		dragSizeSidebar.draggable &&
			document.addEventListener("mousemove", onMouseMove);
		dragSizeSidebar.draggable &&
			document.addEventListener("mouseup", onMouseUp);

		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		};
	}, [dragSizeSidebar]);

	useEffect(() => {
		if (!activeFile) return;
		if (!tabs.find((tabItem) => tabItem.id === activeFile)) {
			setTabs([...tabs, { id: activeFile, saved: true }]);
		}
	}, [activeFile]);

	const fileIdToObject = (fileId: string) => {
		return fileList.find((file) => file.id === fileId);
	};

	const savedStatusOfFile = (idFile: string, saved: boolean) => {
		const newTabs = tabs.map((tab) =>
			tab.id === idFile ? { ...tab, saved: true } : tab
		);
		setTabs(newTabs);
	}

	const saveFile = async (idFile: string) => {
		const fileObj = fileIdToObject(idFile);
		if (fileObj) {
			if (await updateFilenameAPI(
					fileObj.id,
					fileObj.fileName,
					fileObj.content
				)
			) {
				savedStatusOfFile(idFile, true)
			}
		}
	};

	const onButtonClickModalDlgSaveFile = (idButton: string) => {
		console.log(idButton)
	}

	return (
		<>
			<div className="wrapper">
				<Sidebar
					activeButton={activeSidebarButton}
					setActiveSidebarButton={setActiveSidebarButton}
				/>

				<div className="sidebar2" style={{ width: widthSidebar }}>
					{activeSidebarButton === "FILES" && (
						<Filesbar
							title="Dmitriy's notes"
							//fileList={fileList}
							//setFileList={setFileList}
							//activeFile={activeFile}
							//setActiveFile={setActiveFile}
						/>
					)}

					{activeSidebarButton === "SEARCH" && <Searchbar />}

					{activeSidebarButton === "PROFILE" && <Profilebar />}
				</div>

				<div
					className="dragBar"
					onMouseDown={(e) =>
						setDragSizeSidebar({
							draggable: true,
							xMouseStart: e.pageX,
							initPosX: widthSidebar,
						})
					}
					onMouseUp={(e) => console.log(e.clientY)}
				></div>

				<div className="editorWrapper">
					<EditorTabs/>
					<TextEditor
						tabs={tabs}
						setTabs={setTabs}
						filesList={fileList}
						setFileList={setFileList}
						activeFile={activeFile}
					/>
				</div>

				{/* <ModalDialog
					title="Confirm"
					message="Do you want to save the changes you made?"
					faIcon="fa-regular fa-circle-question"
					buttons={[
						{ idButton: "SAVE", caption: "Save" },
						{ idButton: "DONTSAVE", caption: "Don't save" },
						{ idButton: "CANCEL", caption: "Cancel" },
					]}
					onButtonClick={onButtonClickModalDlgSaveFile}
					show={showDlgSaveFile}
					setShow={setShowDlgSaveFile}					
				/> */}
			</div>
		</>
	);
}

export default App;
