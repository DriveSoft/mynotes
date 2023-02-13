import React, { useRef, useState, useContext } from "react";
import { AppContext, AppContextType } from "../Context";
import ModalDialog from "./ModalDialog";
import { files, tabs } from "../types";
import "./EditorTabs.css";


function EditorTabs(){

	const { 
		fileList, 
		
		tabs,
		setTabs,

		activeFile,
		setActiveFile,
		
		updateFile, 
	} = useContext(AppContext) as AppContextType;


	const [showDlgSaveFile, setShowDlgSaveFile] = useState(false)
	const [showDlgSaveFileParams, setShowDlgSaveFileParams] = useState({fileId: 0, fileName: ''})

	const dragTab = useRef<number | null>(null);
	const dragOverTab = useRef<number | null>(null);

	const closeTab = (fileId: number) => {
		setTabs(tabs.filter((fileForClose) => fileForClose.id !== fileId));
		if (activeFile === fileId) setActiveFile(undefined);		
	}

	const onCloseButton = async (e: React.MouseEvent<HTMLElement>, fileToClose: number) => {
		e.stopPropagation();

		const objTab = tabs.find((tab) => tab.id === fileToClose)

		if(objTab) {
			if(!objTab.saved) {
				setShowDlgSaveFileParams({fileId: fileToClose, fileName: getFilename(fileToClose) || ''})
				setShowDlgSaveFile(true)
			} else {
				closeTab(fileToClose)
			}
		}
	};

	const onButtonClickModalDlgSaveFile = async (idButton: string) => {
		if(idButton === 'SAVE') {
			const objFile = fileList.find(file => file.id === showDlgSaveFileParams.fileId)
			try{					
				if(objFile) {
					await updateFile(objFile)
					closeTab(showDlgSaveFileParams.fileId)
				}	
			} catch(e) {
				alert(e)
			}
		}

		if(idButton === 'DONTSAVE') {
			closeTab(showDlgSaveFileParams.fileId)
		}
	}	

	const onDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
		dragTab.current = position
	}

	const onDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
		dragOverTab.current = position
		e.preventDefault()
	}	

	const drop = (e: React.DragEvent<HTMLDivElement>) => {
		if (dragTab.current !== null && dragOverTab.current !== null) {
			const copyListItems = [...tabs];
			const dragItemContent = copyListItems[dragTab.current];
			copyListItems.splice(dragTab.current, 1); // delete current pos
			copyListItems.splice(dragOverTab.current, 0, dragItemContent); // insert at dragOverItem position element dragItemContent 
			dragTab.current = null;
			dragOverTab.current = null;
			setTabs(copyListItems);
			console.log(copyListItems);
		}
	};	

	function getFilename(id: number) {
		return fileList.find((item) => item.id === id)?.fileName || undefined;
	}

	return (
		<div className="editorTabs">
			{tabs.map(
				(fileTab: tabs, index: number) =>
					getFilename(fileTab.id) && (
						<div
							key={fileTab.id}
							className={ activeFile === fileTab.id ? "tab activeTab" : "tab" }
							onClick={() => setActiveFile(fileTab.id)}
							onDragStart={(e) => onDragStart(e, index)}
							onDragEnter={(e) => onDragEnter(e, index)}
							onDragOver={(e) => e.preventDefault()}
							onDragEnd={drop}
							draggable
						>
							<i className="tabIcon fa-regular fa-file-lines"></i>
							<p className="tabFilename">{getFilename(fileTab.id)}</p>
							<p
								className="tabCloseButton"
								onClick={(e) => onCloseButton(e, fileTab.id)}
							>
								<span>{fileTab.saved ? '⨉' : '⬤'}</span>	
							</p>
						</div>
					)				
			)}


			<ModalDialog
				title="Confirm"
				message={`Do you want to save the changes you made to '${showDlgSaveFileParams.fileName}'?`}
				faIcon="fa-regular fa-circle-question"
				buttons={[
					{ idButton: "SAVE", caption: "Save" },
					{ idButton: "DONTSAVE", caption: "Don't save" },
					{ idButton: "CANCEL", caption: "Cancel" },
				]}
				onButtonClick={onButtonClickModalDlgSaveFile}
				show={showDlgSaveFile}
				setShow={setShowDlgSaveFile}					
			/>

		</div>
	);
}

export default EditorTabs;
