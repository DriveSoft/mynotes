import { useState, useEffect, useContext } from "react"
import Sidebar from "./components/Sidebar/Sidebar"
import FilesContainer from "./components/FilesContainer/FilesContainer"
import EditorContainer from "./components/EditorContainer"
import Searchbar from "./components/Searchbar/Searchbar"
import Profilebar from "./components/Profilebar/Profilebar"
import { ButtonId } from "./types";
import { sortFiles, getFileById, getFileContent, URL_API } from "./utils"
import { AppContext, AppContextType } from './Context'
import { IFileAPI, tabs } from "./types"
import { IFileTree } from "./components/Filesbar/types"


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
		const createDataTree = (data: IFileAPI[]): IFileTree[] => {
			const hashTable = Object.create(null)
			data.forEach(file => hashTable[file.id] = file.type === 'FOLDER' ? {...file, childNodes: []} : {...file})
			const dataTree: IFileTree[] = []

			data.forEach(file => {				
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
			setFileList(sortFiles(createDataTree(data)))
		};

		fetchData().catch((reason) => console.log('fetchData failed', reason));
	}, [])

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.code === "KeyS") {
				e.preventDefault();
				let content = tabs.find(item => item.id === activeFile)?.content				
				activeFile && content !== undefined && saveFileContent(activeFile, content)
			}
		}

		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [activeFile, tabs])

	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			let width =
				dragSizeSidebar.initPosX +
				e.pageX -
				dragSizeSidebar.xMouseStart;
			width > 150 && setWidthSidebar(width)
		}

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
		if (!tabs.find((tabItem) => tabItem.id === activeFile)) { // if file not found in tabs, open a new tab for the activeFile
			loadContentById(activeFile)
		}
	}, [activeFile]);



	async function loadContentById(idFile: number) {		
		const objFile = getFileById(fileList, idFile)	
		const fileName = objFile?.fileName	

		if(!objFile?.childNodes && fileName) {						
			const newTab: tabs = { id: idFile, saved: true, tabName: fileName, content: undefined, isLoading: true}
			setTabs([...tabs, newTab])

			try {
				const content = await getFileContent(objFile)			
				newTab.content = content			
			} catch(e) {
				newTab.content = String(e)
			} finally {
				newTab.isLoading = false
				setTabs([...tabs, newTab])	
			}
		}		
	}


	return (
		<>
			<div className="wrapper">
				<Sidebar
					activeButton={activeSidebarButton}
					setActiveSidebarButton={setActiveSidebarButton}
				/>

				{activeSidebarButton !== "NONE" &&
					<div className="sidebar2" style={{ width: widthSidebar }}>
						{activeSidebarButton === "FILES" && (
							<FilesContainer />
						)}

						{activeSidebarButton === "SEARCH" && <Searchbar />}

						{activeSidebarButton === "PROFILE" && <Profilebar />}
					</div>
				}

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
					<EditorContainer />
				</div> 
			</div>
		</>
	);
}

export default App;
