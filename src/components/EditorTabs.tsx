import React, { useRef } from "react"
import { tabs } from "../types"
import "./EditorTabs.css"

interface EditorTabsProps {
	tabs: tabs[]
	activeFile: number | undefined
	onChangeTab?: (tab: tabs | undefined) => void
	onCloseTab?: (tab:tabs) => boolean | undefined
	onClosedTab?: (newStateTabs: tabs[], tabFileId: number) => void
	onDropFinished?: (newStateTabs: tabs[]) => void
}

function EditorTabs({
	tabs,
	activeFile,
	onChangeTab,
	onCloseTab,
	onClosedTab,
	onDropFinished,
}: EditorTabsProps) {

	const dragTab = useRef<number | null>(null)
	const dragOverTab = useRef<number | null>(null)

	const closeTab = (objTab: tabs) => {
		if (onClosedTab) {
			const newTabsState = tabs.filter(
				(fileForClose) => fileForClose.id !== objTab.id
			);
			onClosedTab(newTabsState, objTab.id);
		}
	}

	const onCloseButton = (
		e: React.MouseEvent<HTMLElement>,
		fileToClose: number
	) => {
		e.stopPropagation()
		const objTab = tabs.find((tab) => tab.id === fileToClose)

		if (onCloseTab && objTab) {
			const result = onCloseTab(objTab)
			result !== false && closeTab(objTab)
		}
	}

	const onDragStart = (
		e: React.DragEvent<HTMLDivElement>,
		position: number
	) => {
		dragTab.current = position
	}

	const onDragEnter = (
		e: React.DragEvent<HTMLDivElement>,
		position: number
	) => {
		dragOverTab.current = position;
		e.preventDefault()
	};

	const drop = (e: React.DragEvent<HTMLDivElement>) => {
		if (
			onDropFinished &&
			dragTab.current !== null &&
			dragOverTab.current !== null
		) {
			const copyListItems = [...tabs]
			const dragItemContent = copyListItems[dragTab.current]
			copyListItems.splice(dragTab.current, 1) // delete current pos
			copyListItems.splice(dragOverTab.current, 0, dragItemContent) // insert at dragOverItem position element dragItemContent
			dragTab.current = null
			dragOverTab.current = null
			onDropFinished(copyListItems)
		}
	};

	const onClickTab = (tab: tabs) => {
		onChangeTab && onChangeTab(tab)
	}

	return (
		<div className="editorTabs">
			{tabs.map(
				(fileTab: tabs, index: number) => (
					<div
						role={"listitem"}
						key={fileTab.id}
						className={
							activeFile === fileTab.id ? "tab activeTab" : "tab"
						}
						onClick={() => onClickTab(fileTab)}
						onDragStart={(e) => onDragStart(e, index)}
						onDragEnter={(e) => onDragEnter(e, index)}
						onDragOver={(e) => e.preventDefault()}
						onDragEnd={drop}
						draggable
					>
						<i className="tabIcon fa-regular fa-file-lines"></i>
						<p className="tabFilename">{fileTab.tabName}</p>
						<p
							className="tabCloseButton"
							onClick={(e) => onCloseButton(e, fileTab.id)}
						>
							{/* <span>{fileTab.saved ? "⨉" : "⬤"}</span> */}
							<span data-testid="buttonClose" className={fileTab.saved ? "iconCross" : "iconCircle"}></span>
						</p>
					</div>
				)
			)}
		</div>
	);
}

export default EditorTabs;
