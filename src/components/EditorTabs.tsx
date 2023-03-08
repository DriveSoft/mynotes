import React, { useRef, useState, useContext } from "react";
import ModalDialog from "./ModalDialog";
import { tabs } from "../types";
import "./EditorTabs.css";

interface EditorTabsProps {
	tabs: tabs[]
	setTabs: (value: tabs[]) => void
	activeFile: number | undefined
	setActiveFile: (value: number | undefined) => void
	saveFileContent: (idFile: number, content: string) => Promise<any>
}

function EditorTabs({tabs, setTabs, activeFile, setActiveFile, saveFileContent}: EditorTabsProps){
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
				setShowDlgSaveFileParams({fileId: fileToClose, fileName: objTab.tabName})
				setShowDlgSaveFile(true)
			} else {
				closeTab(fileToClose)
			}
		}
	};

	const onButtonClickModalDlgSaveFile = async (idButton: string) => {
		if(idButton === 'SAVE') {
			let content = tabs.find(item => item.id === activeFile)?.content
			content && await saveFileContent(showDlgSaveFileParams.fileId, content)
			closeTab(showDlgSaveFileParams.fileId)
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


	return (
		<div className="editorTabs">
			{tabs.map(
				(fileTab: tabs, index: number) =>
					//getFilename(fileTab.id) && (
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
							{/* <p className="tabFilename">{getFilename(fileTab.id)}</p> */}
							<p className="tabFilename">{fileTab.tabName}</p>
							<p
								className="tabCloseButton"
								onClick={(e) => onCloseButton(e, fileTab.id)}
							>
								<span>{fileTab.saved ? '⨉' : '⬤'}</span>	
							</p>
						</div>
					//)				
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
