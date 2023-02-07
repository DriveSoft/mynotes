import React, { useRef } from "react";
import { files, tabs } from "../types";
import "./EditorTabs.css";

interface EditorTabsProps {
	fileList: files[];
	activeFile: string | undefined;
	setActiveFile: (value: string | undefined) => void;
	tabs: tabs[];
	setTabs: (value: tabs[]) => void;
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
		setTabs(tabs.filter((fileForClose) => fileForClose.id !== fileToClose));
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

	const getFilename = (files: files[], id: string) => {
		return files.find((item) => item.id === id)?.fileName || undefined;
	}

	return (
		<div className="editorTabs">
			{tabs.map(
				// (fileId: string, index: number) =>
				// 	getFilename(fileList, fileId) && (
				// 		<div
				// 			key={fileId}
				// 			className={ activeFile === fileId ? "tab activeTab" : "tab" }
				// 			onClick={() => setActiveFile(fileId)}
				// 			onDragStart={(e) => onDragStart(e, index)}
				// 			onDragEnter={(e) => onDragEnter(e, index)}
				// 			onDragOver={(e) => e.preventDefault()}
				// 			onDragEnd={drop}
				// 			draggable
				// 		>
				// 			<i className="tabIcon fa-regular fa-file-lines"></i>
				// 			<p className="tabFilename">{getFilename(fileList, fileId)}</p>
				// 			<p
				// 				className="tabCloseButton"
				// 				onClick={(e) => onCloseButton(e, fileId)}
				// 			>
				// 				⨉
				// 			</p>
				// 		</div>
				// 	)
				(fileTab: tabs, index: number) =>
					getFilename(fileList, fileTab.id) && (
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
							<p className="tabFilename">{getFilename(fileList, fileTab.id)}</p>
							<p
								className="tabCloseButton"
								onClick={(e) => onCloseButton(e, fileTab.id)}
							>
								<span>{fileTab.saved ? '⨉' : '⬤'}</span>	
							</p>
						</div>
					)				
			)}
		</div>
	);
}

export default EditorTabs;
