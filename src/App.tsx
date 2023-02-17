import { useState, useEffect, useContext } from "react";
import Sidebar from "./components/Sidebar";
import Filesbar from "./components/Filesbar/Filesbar";
import Searchbar from "./components/Searchbar";
import Profilebar from "./components/Profilebar";
import EditorTabs from "./components/EditorTabs";
import TextEditor from "./components/TextEditor";
import { ButtonId } from "./types";
import { sortFiles, getFileById, URL_API } from "./utils";
import { AppContext, AppContextType } from './Context';
import { files, fileAPI, fileType } from "./types";


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
		tabs,
		setTabs,
		saveFileContent
	} = useContext(AppContext) as AppContextType;

	const [activeSidebarButton, setActiveSidebarButton] = useState<ButtonId>("FILES");

	const [widthSidebar, setWidthSidebar] = useState(260);
	const [dragSizeSidebar, setDragSizeSidebar] = useState({
		draggable: false,
		xMouseStart: 0,
		initPosX: 0,
	});

	useEffect(() => {
		const createDataTree = (data: fileAPI[]): files[] => {
			const hashTable = Object.create(null);
			data.forEach(file => hashTable[file.id] = file.type === 'FOLDER' ? {...file, childNodes: [], isOpened: false} : {...file});
			const dataTree: files[] = [];

			data.forEach(file => {
				console.log(file.id)
				if(file.parentId > 0 && hashTable[file.parentId]) {     
					if(hashTable[file.parentId]?.childNodes) hashTable[file.parentId].childNodes.push(hashTable[file.id])
					else dataTree.push(hashTable[file.id]) // in case, if file referencing to not Folder
			  	} else {
					dataTree.push(hashTable[file.id])
			  	}
			})

			console.log(dataTree)
			return dataTree
		  };

		const fetchData = async () => {
			const response = await fetch(URL_API);
			const data = await response.json();
			//setFileList(sortFiles(data))
			setFileList(sortFiles(createDataTree(data)));
		};

		fetchData();
		console.log('fetch')
	}, []);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.code === "KeyS") {
				e.preventDefault();
				let content = tabs.find(item => item.id === activeFile)?.content
				activeFile && content && saveFileContent(activeFile, content);
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [activeFile, tabs]);

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
			const content = getFileById(fileList, activeFile)?.content
			setTabs([...tabs, { id: activeFile, saved: true, content: content}]);
		}
	}, [activeFile]);

	 const fileIdToObject = (fileId: number) => {
	 	return fileList.find((file) => file.id === fileId);
	};

	const savedStatusOfFile = (idFile: number, saved: boolean) => {
		const newTabs = tabs.map((tab) =>
			tab.id === idFile ? { ...tab, saved: true } : tab
		);
		setTabs(newTabs);
	}

	// const saveFileContent = async (idFile: number, content: string) => {
	// 	const newFileList = await saveFileContentToApiAndGetUpdatedState(fileList, idFile, content)
	// 	if (newFileList) {
	// 		newFileList && setFileList(newFileList)
	// 		savedStatusOfFile(idFile, true)			
	// 	}
	// 	// //const fileObj = fileIdToObject(idFile);
	// 	// const fileObj = getFileById(fileList, idFile);
	// 	// if(!fileObj) return
	// 	// fileObj.content = content

	// 	// if (fileObj) {			
	// 	// 	if (await updateFilenameAPI(
	// 	// 			fileObj.id,
	// 	// 			fileObj.fileName,
	// 	// 			fileObj.content,
	// 	// 			fileObj.parentId,
	// 	// 			fileObj?.childNodes ? 'FOLDER' : 'FILE'					
	// 	// 		)
	// 	// 	) {
	// 	// 		const newFileList = getUpdatedFileList(fileList, fileObj)
	// 	// 		newFileList && setFileList(newFileList)
	// 	// 		savedStatusOfFile(idFile, true)
	// 	// 	}
	// 	// }
	// };

	return (
		<>
			<div className="wrapper">
				<Sidebar
					activeButton={activeSidebarButton}
					setActiveSidebarButton={setActiveSidebarButton}
				/>

				<div className="sidebar2" style={{ width: widthSidebar }}>
					{activeSidebarButton === "FILES" && (
						<Filesbar title="Dmitriy's notes"/>
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
			</div>
		</>
	);
}

export default App;
