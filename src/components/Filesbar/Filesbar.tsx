import React, { useState, useRef, useContext } from "react"
import { AppContext, AppContextType } from "../../Context"
import ContexMenu from "../ContexMenu"
import ModalDialog from "../ModalDialog"
import FileItem from "./FileItem"
import { files, typeFile } from "../../types"
import { getFileById, changeIsOpenedAndUpdateFileList } from "../../utils"
import "./Filesbar.css"


interface FilesbarProps {
	title?: string
}

function Filesbar({title}: FilesbarProps) {

	const { 
		fileList, 
		setFileList, 

		activeFile,
		setActiveFile,
		
		createNewFile, 
		renameFilename,
		deleteFile

	} = useContext(AppContext) as AppContextType

	type typeNewFileAtParent = {parentId: number, type: typeFile}

	const [focusedCmp, setFocusedCmp] = useState(false) 
	const [showInputNewFileAtParent, setShowInputNewFileAtParent] = useState<typeNewFileAtParent>({parentId: -2, type: 'file'})
	const [renameFileNameId, setRenameFileNameId] = useState(0)

	const [error, setError] = useState({
		error: "",
		left: 0,
		top: 0,
		width: 0,
	})

	const [showMenu, setShowMenu] = useState({
		show: false,
		x: 0,
		y: 0,
		fileId: 0,
	})

	const [showDialogConfirmDelete, setShowDialogConfirmDelete] = useState(false)
	const [showDialogConfirmDeleteParams, setShowDialogConfirmDeleteParams] = useState({fileName: '', fileId: 0})

	const inputRenameRef = useRef(null);

	const errorFileExists = (fileName: string) =>
		`A file or folder ${fileName} already exists at this location. Please choose a different name.`


	const onFileCreate = async(success: boolean, filename: string, inputEl: any) => {
		setError({ error: '', left: 0, top: 0, width: 0 })
		inputEl.current.style.outline = ""

		if (success) {
			try {
				await createNewFile(filename, showInputNewFileAtParent.parentId, showInputNewFileAtParent.type)
				setShowInputNewFileAtParent({parentId: -1, type: 'file'})
			} catch(e) {
				alert(e)
			}
		} else {
			setShowInputNewFileAtParent({parentId: -1, type: 'file'})
		}				
	}

	const onFileRename = async(
		fileId: number,
		success: boolean,
		newFilename: string,
		inputEl: any
	) => {		
		setError({ error: '', left: 0, top: 0, width: 0 })
		inputEl.current.style.outline = ""
		
		if (success) {					
			try {								
				await renameFilename(fileId, newFilename)
				setRenameFileNameId(0)
			} catch(e) {					
				alert(e)
			}					
		} else {
			setRenameFileNameId(0)
		}
	}

	const onContextMenu = (
		e: React.MouseEvent<HTMLDivElement>,
		fileId: number
	) => {
		e.preventDefault()
		setShowMenu({
			show: true,
			x: e.pageX,
			y: e.pageY,
			fileId: fileId,
		})
	}

	const onClickItem = async(fileId: number, itemId: string) => {
		if (itemId === "NEW_FILE") {
			setShowInputNewFileAtParent({parentId: 0, type: 'file'})
		}
				
		if (itemId === "EDIT_FILE") {
			setRenameFileNameId(fileId)
			setTimeout(() => {
				//@ts-ignore
				if (inputRenameRef) inputRenameRef?.current?.select()
			}, 0)
		}

		if (itemId === "DELETE_FILE") {			
			const fileObj = getFileById(fileList, fileId)
			setShowDialogConfirmDeleteParams({fileId: fileId, fileName: fileObj?.fileName || ''})
			setShowDialogConfirmDelete(true)
		}
	}

	const onButtonClickModalDlgConfirmDelete = async(idButton: string) => {
		if(idButton === 'DELETE') {
			try {
				await deleteFile(showDialogConfirmDeleteParams.fileId)		
			} catch(e) {
				alert(e)
		   }			
		}
	}


	const onChangeValidator = (
		fileId: number,
		fileName: string,
		inputEl: any
	): boolean => {

		const result = fileList.every(item => item.fileName !== fileName || fileId === item.id)

		if (!result && inputEl) {
			inputEl.current.style.outline = "1px solid red"
			const elRect = inputEl.current.getBoundingClientRect()
			setError({
				error: errorFileExists(fileName),
				left: elRect.left - 1,
				top: elRect.bottom - 1,
				width: inputEl?.current?.offsetWidth+2 ?? 0
			});
		} else {
			inputEl.current.style.outline = ""
			setError({ error: '', left: 0, top: 0, width: 0 })		
		}

		return result	
	};


	const onClickFileItem = (file: files) => {
		setActiveFile(file.id)	
		
		if(file?.childNodes) {
			const newFileList = changeIsOpenedAndUpdateFileList(fileList, file.id)		
			setFileList(newFileList)
		}
	}

	const onClickButtonNewFile = (type: typeFile) => {
		if(activeFile !== undefined){
			const objFile = getFileById(fileList, activeFile)
			//objFile && setShowInputNewFileAtParent(objFile.parentId)
			if(objFile) {
				if(objFile?.childNodes) {
					setShowInputNewFileAtParent({parentId: objFile.id, type: type})	
				} else {
					setShowInputNewFileAtParent({parentId: objFile.parentId, type: type})	
				}
			}
			return
		}		
		setShowInputNewFileAtParent({parentId: 0, type: type})

	}

	const renderFiles = (files: files[], newFileAtParent: typeNewFileAtParent) => {
		let _newFileAtParent = newFileAtParent.parentId 
		console.log(newFileAtParent)

		const render = (file: files, level: number) => {
			const fileItemEl = (
				<FileItem
					fileObj={file}
					selected={activeFile === file.id}
					focused={focusedCmp}
					mode={renameFileNameId === file.id ? 'RENAME_FILE' : undefined}
					onClick={onClickFileItem}
					onMenu={(e, fileId) => onContextMenu(e, fileId)}
					onFileRenamed={onFileRename}
					onChangeValidator={onChangeValidator}
					key={file.id}
					level={level}					
				>	
					{						
						file?.childNodes && file.isOpened && file.childNodes.map((file: any) => render(file, level+1))
					}
				</FileItem>					
			)

			if (file.parentId == _newFileAtParent) {
				_newFileAtParent = -1
				return (
					<React.Fragment key={file.id}>
						<FileItem
							fileObj={{id: 0, fileName: '', content: '', parentId: 0}}	
							selected={false}
							focused={focusedCmp}		
							mode='NEW_FILE'			
							onFileCreated={onFileCreate}
							onChangeValidator={onChangeValidator}
							key={'newFile'}
							level={level}
						/>

						{fileItemEl}
					</React.Fragment>				
				)
			}

			return (fileItemEl)			
		}

		return files.map((file: any) => render(file, 0))

	}	

	return (
		<div
			className="filesbar"
			tabIndex={0}
			onFocus={() => setFocusedCmp(true)}
			onBlur={() => {
				setFocusedCmp(false);
			}}
			onContextMenu={(e) => onContextMenu(e, 0)}
		>
			<span>EXPLORER</span>
			<div className="files">
				<div className="filesTitle">
					{title && <span>{title}</span>}

					<i
						className="fa-regular fa-folder"
						onClick={() => onClickButtonNewFile('folder')}
					></i>					
					<i
						className="fa-regular fa-file"
						onClick={() => onClickButtonNewFile('file')}
					></i>
										
				</div>

				<div style={{ position: "relative" }}>

					{renderFiles(fileList, showInputNewFileAtParent)}

					{/* dark transparent layer */}
					{(renameFileNameId !== 0 || showInputNewFileAtParent.parentId > -1) && (
						<div
							style={{
								position: "absolute",
								left: "0",
								top: "0",
								backgroundColor: "hsla(0, 0%, 15%, 0.7)",
								zIndex: "1",
								bottom: "0",
								right: "0",
							}}
						></div>
					)}
				</div>
			</div>

			{showMenu.show && (
				<ContexMenu
					showMenu={showMenu}
					onClickItem={onClickItem}
					setShowMenu={setShowMenu}
				/>
			)}

			{error.error && (
				<div
					className='error'
					style={{
						position: "fixed",
						left: error.left,
						top: error.top,
						width: error.width,
						border: "1px solid red",
						backgroundColor: "#500000",
						padding: "3px 8px 3px 8px",
						zIndex: "3",
					}}
				>
					<span>{error.error}</span>
				</div>
			)}

		
			<ModalDialog
				title="Confirm"
				message={`Are you sure you want to delete '${showDialogConfirmDeleteParams.fileName}'?`}
				faIcon="fa-regular fa-circle-question"
				buttons={[
					{ idButton: "DELETE", caption: "Delete" },					
					{ idButton: "CANCEL", caption: "Cancel" },
				]}
				onButtonClick={onButtonClickModalDlgConfirmDelete}
				show={showDialogConfirmDelete}
				setShow={setShowDialogConfirmDelete}					
			/>

		</div>
	);
}

export default Filesbar;
