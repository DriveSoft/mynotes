import React, { useRef } from "react";
import { files } from "../types";
import "./EditorTabs.css";

interface EditorTabsProps {
	fileList: files;
	activeFile: string | undefined;
	setActiveFile: (value: string | undefined) => void;
	tabs: string[];
	setTabs: (value: string[]) => void;
}

function EditorTabs({
	fileList,
	activeFile,
	setActiveFile,
	tabs,
	setTabs,
}: EditorTabsProps) {

	const dragTab = useRef<number | null>(null);
	const dragOverTab = useRef<number | null>(null);

	const onCloseButton = (
		e: React.MouseEvent<HTMLElement>,
		fileToClose: string
	) => {
		e.stopPropagation();
		setTabs(tabs.filter((fileForClose) => fileForClose !== fileToClose));
		if (activeFile === fileToClose) setActiveFile(undefined);
	};

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
				(fileId: string, index: number) =>
					fileList[fileId] && (
						<div
							key={fileId}
							className={ activeFile === fileId ? "tab activeTab" : "tab" }
							onClick={() => setActiveFile(fileId)}
							onDragStart={(e) => onDragStart(e, index)}
							onDragEnter={(e) => onDragEnter(e, index)}
							onDragOver={(e) => e.preventDefault()}
							onDragEnd={drop}
							draggable
						>
							<i className="tabIcon fa-regular fa-file-lines"></i>
							<p className="tabFilename">{fileList[fileId]}</p>
							<p
								className="tabCloseButton"
								onClick={(e) => onCloseButton(e, fileId)}
							>
								⨉
							</p>
						</div>
					)
			)}
		</div>
	);
}

export default EditorTabs;
