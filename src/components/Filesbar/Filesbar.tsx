import React, { useState, useRef, useContext, useEffect } from "react"
import ContexMenu from "../ContexMenu"
import ModalDialog from "../ModalDialog"
import FileItem from "./FileItem"
import { files, typeFile } from "./types"
import { 
	getFileById, 
	createFileAndUpdateFileList, 
	changeIsOpenedAndUpdateFileList,
	changeFilenameAndUpdateFileList,
	deleteFileAndUpdateFileList,
	getNewId
} from "./utils"
import "./Filesbar.css"


interface FilesbarProps {
	title?: string
	treeData: files[]
	selectedFile: number | undefined
	onFileCreate?: (fileName: string, type: typeFile, parentId: number) => Promise<number>
	onFileRename?: (fileObj: files) => Promise<any>
	onFileDelete?: (fileId: number) => Promise<any>
	onSelect?: (fileId: number) => void
}

function Filesbar({
		title, 
		treeData, 
		selectedFile,
		onFileCreate,
		onFileRename,
		onFileDelete,
		onSelect
	}: FilesbarProps) {

	type typeNewFileAtParent = {parentId: number, type: typeFile}

	const [data, setData] = useState<files[]>([])
	
	const [focusedCmp, setFocusedCmp] = useState(false)
	const [selectedFileId, setSelectedFileId] = useState<number | undefined>(undefined)
	const [showInputNewFileAtParent, setShowInputNewFileAtParent] = useState<typeNewFileAtParent>({parentId: -2, type: 'file'})
	const [renameFileNameId, setRenameFileNameId] = useState(0)
	const [waitDeletingIdFile, setWaitDeletingIdFile] = useState<number | null>(null)

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

	useEffect(() => {
		setData(treeData)
	}, [treeData])

	useEffect(() => {
		setSelectedFileId(selectedFile)
	}, [selectedFile])

	const [showDialogConfirmDelete, setShowDialogConfirmDelete] = useState(false)
	const [showDialogConfirmDeleteParams, setShowDialogConfirmDeleteParams] = useState({fileName: '', fileId: 0})

	const inputRenameRef = useRef(null);

	const errorFileExists = (fileName: string) =>
		`A file or folder ${fileName} already exists at this location. Please choose a different name.`


	const _onFileCreate = async(success: boolean, filename: string, inputEl: any) => {
		setError({ error: '', left: 0, top: 0, width: 0 })
		inputEl.current.style.outline = ""

		if (success) {		
			if(onFileCreate){
				const fileId = await onFileCreate(filename, showInputNewFileAtParent.type, showInputNewFileAtParent.parentId)
				if(fileId) {
					const updatedTreeData = createFileAndUpdateFileList(data, fileId, showInputNewFileAtParent.parentId, filename, showInputNewFileAtParent.type)
					setData(updatedTreeData)
					setShowInputNewFileAtParent({parentId: -1, type: 'file'})
				}
			} else {
				const updatedTreeData = createFileAndUpdateFileList(data, getNewId(data), showInputNewFileAtParent.parentId, filename, showInputNewFileAtParent.type)
				setData(updatedTreeData)								
				setShowInputNewFileAtParent({parentId: -1, type: 'file'})	
			} 			
		} else {
			setShowInputNewFileAtParent({parentId: -1, type: 'file'})
		}				
	}

	const _onFileRename = async(
		fileObj: files,
		success: boolean,
		inputEl: any
	) => {		
		setError({ error: '', left: 0, top: 0, width: 0 })
		inputEl.current.style.outline = ""
		
		if (success) {											
			onFileRename && await onFileRename(fileObj)							
			const updatedTreeData = changeFilenameAndUpdateFileList(data, fileObj.id, fileObj.fileName)
			setData(updatedTreeData)
			setRenameFileNameId(0)								
		} else {
			setRenameFileNameId(0)
		}
	}

	const onButtonClickModalDlgConfirmDelete = async(idButton: string) => {
		if(idButton === 'DELETE') {			
			if(onFileDelete) {
				setWaitDeletingIdFile(showDialogConfirmDeleteParams.fileId)
				await onFileDelete(showDialogConfirmDeleteParams.fileId).finally(() => setWaitDeletingIdFile(null))
			}
						
			const updatedTreeData = deleteFileAndUpdateFileList(data, showDialogConfirmDeleteParams.fileId)
			setData(updatedTreeData)
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
			const fileObj = getFileById(data, fileId)
			setShowDialogConfirmDeleteParams({fileId: fileId, fileName: fileObj?.fileName || ''})
			setShowDialogConfirmDelete(true)
		}
	}

	const onChangeValidator = (
		fileId: number,
		parentId: number,
		fileName: string,
		inputEl: any
	): boolean => {

		const filesInParentFolder = parentId > 0 ? getFileById(data, parentId)?.childNodes : data
		//const result = data.every(item => item.fileName !== fileName || fileId === item.id)
		let result = false
		if(filesInParentFolder) result = filesInParentFolder.every(item => item.fileName.toLowerCase() !== fileName.toLowerCase() || fileId === item.id)

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
		//setActiveFile(file.id)	
		setSelectedFileId(file.id)
		onSelect && onSelect(file.id)
		
		if(file?.childNodes) {
			const newFileList = changeIsOpenedAndUpdateFileList(data, file.id)		
			setData(newFileList)
		}
	}

	const onClickButtonNewFile = (type: typeFile) => {		
		if(selectedFileId !== undefined){
			const objFile = getFileById(data, selectedFileId)
			if(objFile) {
				if(objFile?.childNodes) {
					setShowInputNewFileAtParent({parentId: objFile.id, type: type})	
				} else {
					setShowInputNewFileAtParent({parentId: objFile.parentId, type: type})	
				}
			} else {
				setShowInputNewFileAtParent({parentId: 0, type: type})	
			}
			return
		}		
		setShowInputNewFileAtParent({parentId: 0, type: type})
	}

	const renderFiles = (files: files[], newFileAtParent: typeNewFileAtParent) => {
		let _newFileAtParent = newFileAtParent.parentId 
		
		const sortFiles = (files: files[]) => {
			files.sort((a, b) => a.fileName.toLowerCase() > b.fileName.toLowerCase() ? 1 : -1)
		}
		
		sortFiles(files)

		const render = (file: files, level: number) => {			
			
			const fileItemEl = (
				<FileItem
					fileObj={file}
					selected={selectedFileId === file.id}
					focused={focusedCmp}
					mode={renameFileNameId === file.id ? 'RENAME_FILE' : undefined}
					onClick={onClickFileItem}
					onMenu={(e, fileId) => onContextMenu(e, fileId)}
					onFileRenamed={_onFileRename}
					onChangeValidator={onChangeValidator}
					key={file.id}
					level={level}	
					isWaitingIcon={waitDeletingIdFile === file.id}				
				>
				<>

					{/* In case when we are creating file inside empty folder */}
					{
						file?.childNodes && file?.childNodes.length===0 && file.id == _newFileAtParent && 					
						<FileItem
							//fileObj={{id: 0, fileName: '', content: '', parentId: _newFileAtParent}}	
							fileObj={ newFileAtParent.type === 'folder' ? {id: 0, fileName: '', content: '', parentId: file.parentId, childNodes: []} : {id: 0, fileName: '', content: '', parentId: file.parentId}}	
							selected={false}
							focused={focusedCmp}		
							mode='NEW_FILE'			
							onFileCreated={_onFileCreate}
							onChangeValidator={onChangeValidator}
							key={'newFile'}
							level={level+1}
						/>	
						
					}

					{/* we have to open folder if we are creating file inside it */}
					{file?.childNodes && file.id == _newFileAtParent ? file.isOpened = true : file.isOpened = file.isOpened}					
					
					{/* sorting childs files */}
					{file?.childNodes && file.isOpened && sortFiles(file.childNodes)}
					
					{/* rendering */}
					{file?.childNodes && file.isOpened && file.childNodes.map((file: any) => render(file, level+1))}
				</>		
				</FileItem>					
			)

			if (file.parentId == _newFileAtParent) {
				_newFileAtParent = -1
				return (
					<React.Fragment key={file.id}>
						<FileItem
							fileObj={ newFileAtParent.type === 'folder' ? {id: 0, fileName: '', content: '', parentId: file.parentId, childNodes: []} : {id: 0, fileName: '', content: '', parentId: file.parentId}}	
							selected={false}
							focused={focusedCmp}		
							mode='NEW_FILE'			
							onFileCreated={_onFileCreate}
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


		//const sortFiles = (files: files[]) => {
		//	files.sort
		//}

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
			{/* <span>EXPLORER</span> */}
			<div className="files">
				<div className="filesTitle">
					{title && <span>{title}</span>} 

					<i
						className="fa-regular fa-folder"
						onClick={() => onClickButtonNewFile('folder')}
						aria-label="Create a new file"
					></i>					
					<i
						className="fa-regular fa-file"
						onClick={() => onClickButtonNewFile('file')}
						aria-label="Create a new folder"
					></i>
										
				</div>

				<div style={{ position: "relative" }}>

					{renderFiles(data, showInputNewFileAtParent)}

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
