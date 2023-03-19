import React, { useState, useRef, useEffect } from "react"
import ContexMenu from "../ContexMenu/ContexMenu"
import ModalDialog from "../ModalDialog/ModalDialog"
import FileItem from "./FileItem"
import { IFileTree, typeFile, IFileItem } from "./types"
import { 
	getFileById, 
	createFileAndUpdateFileList, 
	changeFilenameAndUpdateFileList,
	deleteFileAndUpdateFileList,
	getNewId,
	getParentId
} from "./utils"
import "./Filesbar.css"


interface FilesbarProps {
	title?: string
	treeData: IFileTree[]
	selectedFile: number | undefined
	expanded: number[]
	onFileCreate?: (fileName: string, type: typeFile, parentId: number) => Promise<number>
	onFileRename?: (fileObj: IFileTree, parentId: number) => Promise<any>
	onFileDelete?: (fileId: number) => Promise<any>
	onSelect?: (fileId: number) => void
	onExpanded: (expandedItems: number[]) => void
}

function Filesbar({
		title, 
		treeData, 
		selectedFile,
		expanded,		
		onFileCreate,
		onFileRename,
		onFileDelete,
		onSelect,
		onExpanded
	}: FilesbarProps) {

	type typeNewFileAtParent = {parentId: number, type: typeFile}

	const [data, setData] = useState<IFileTree[]>([])
	
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

	const [showDialogConfirmDeleteParams, setShowDialogConfirmDeleteParams] = useState({show: false, fileName: '', fileId: 0})

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
		fileObj: IFileItem,
		success: boolean,
		inputEl: any
	) => {		
		setError({ error: '', left: 0, top: 0, width: 0 })
		inputEl.current.style.outline = ""
		
		if (success) {											
			//onFileRename && await onFileRename(fileObj)							
			const objFile: IFileTree = {id: fileObj.id, fileName: fileObj.fileName, content: fileObj.content}
			onFileRename && await onFileRename(objFile, fileObj.parentId)							
			const updatedTreeData = changeFilenameAndUpdateFileList(data, fileObj.id, fileObj.fileName)
			setData(updatedTreeData)
			setRenameFileNameId(0)								
		} else {
			setRenameFileNameId(0)
		}
	}

	const onButtonClickModalDlgConfirmDelete = async(idButton: string) => {
		if(idButton === 'DELETE') {			
			setShowDialogConfirmDeleteParams({show: false, fileId: 0, fileName: ''})
			if(onFileDelete) {
				setWaitDeletingIdFile(showDialogConfirmDeleteParams.fileId)
				await onFileDelete(showDialogConfirmDeleteParams.fileId).finally(() => setWaitDeletingIdFile(null))
			}		
			const updatedTreeData = deleteFileAndUpdateFileList(data, showDialogConfirmDeleteParams.fileId)
			setData(updatedTreeData)
		}

		if(idButton === 'CANCEL') {	
			setShowDialogConfirmDeleteParams({show: false, fileId: 0, fileName: ''})	
		}

		if(idButton === 'SYSCLOSE') {	
			setShowDialogConfirmDeleteParams({show: false, fileId: 0, fileName: ''})	
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
			setShowDialogConfirmDeleteParams({show: true, fileId: fileId, fileName: fileObj?.fileName || ''})
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


	const onClickFileItem = (file: IFileItem) => {		
		setSelectedFileId(file.id)
		onSelect && onSelect(file.id)
		
		if(file?.childNodes) {
			//const newFileList = changeIsOpenedAndUpdateFileList(data, file.id)		
			//setData(newFileList)

			const found = expanded.find(item => file.id === item)
			const newExpanded = found ? expanded.filter(item => item !== file.id) : [...expanded, file.id]
			onExpanded(newExpanded)
		}
	}

	const onClickButtonNewFile = (type: typeFile) => {		
		if(selectedFileId !== undefined){
			const objFile = getFileById(data, selectedFileId)

			objFile?.id && console.log('getParentId', getParentId(data, objFile?.id, 0))
			

			if(objFile) {
				if(objFile?.childNodes) {
					setShowInputNewFileAtParent({parentId: objFile.id, type: type})	
				} else {
					//setShowInputNewFileAtParent({parentId: objFile.parentId, type: type})	
					setShowInputNewFileAtParent({parentId: getParentId(data, objFile.id, 0), type: type})					
				}
			} else {
				setShowInputNewFileAtParent({parentId: 0, type: type})	
			}
			return
		}		
		setShowInputNewFileAtParent({parentId: 0, type: type})
	}


	const renderFiles = (files: IFileTree[], newFileAtParent: typeNewFileAtParent) => {
		let _newFileAtParent = newFileAtParent.parentId 
		
		const sortFiles = (files: IFileTree[]) => {
			files.sort((a, b) => a.fileName.toLowerCase() > b.fileName.toLowerCase() ? 1 : -1)
		}
		
		sortFiles(files)

		const render = (file: IFileTree, level: number, parentId: number) => {			
			const fileItemObj: IFileItem = {...file, parentId} //IFileItem just add isOpened property
			if (file?.childNodes) fileItemObj.isOpened = expanded.indexOf(file.id) !== -1

			const fileItemEl = (
				<FileItem
					fileObj={fileItemObj}
					selected={selectedFileId === fileItemObj.id}
					focused={focusedCmp}
					mode={renameFileNameId === fileItemObj.id ? 'RENAME_FILE' : undefined}
					onClick={onClickFileItem}
					onMenu={(e, fileId) => onContextMenu(e, fileId)}
					onFileRenamed={_onFileRename}
					onChangeValidator={onChangeValidator}
					key={fileItemObj.id}
					level={level}	
					isWaitingIcon={waitDeletingIdFile === fileItemObj.id}				
				>
				<>

					{/* In case when we are creating file inside empty folder */}
					{
						fileItemObj?.childNodes && fileItemObj?.childNodes.length===0 && fileItemObj.id == _newFileAtParent && 					
						<FileItem
							//fileObj={{id: 0, fileName: '', content: '', parentId: _newFileAtParent}}	
							fileObj={ newFileAtParent.type === 'folder' ? {id: 0, fileName: '', content: '', parentId: parentId, childNodes: []} : {id: 0, fileName: '', content: '', parentId: parentId}}	
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
					{/* {file?.childNodes && file.id == _newFileAtParent ? file.isOpened = true : file.isOpened = file.isOpened} */}
					{fileItemObj?.childNodes && fileItemObj.id == _newFileAtParent && !fileItemObj.isOpened && onExpanded([...expanded, fileItemObj.id]) }
					
					{/* sorting childs files */}
					{ fileItemObj?.childNodes && fileItemObj.isOpened && sortFiles(fileItemObj.childNodes) }
					{/* {file?.childNodes && expanded.indexOf(file.id) !== -1 && sortFiles(file.childNodes)} */}
					
					{/* rendering */}
					{ fileItemObj?.childNodes && fileItemObj.isOpened && fileItemObj.childNodes.map((file: any) => render(file, level+1, fileItemObj.id)) }
					{/* {file?.childNodes && expanded.indexOf(file.id) !== -1 && file.childNodes.map((file: any) => render(file, level+1))} */}
				</>		
				</FileItem>					
			)

			if (parentId == _newFileAtParent) {
				_newFileAtParent = -1
				return (
					<React.Fragment key={fileItemObj.id}>
						<FileItem
							fileObj={ newFileAtParent.type === 'folder' ? {id: 0, fileName: '', content: '', parentId: parentId, childNodes: []} : {id: 0, fileName: '', content: '', parentId: parentId}}	
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

		return files.map((file: any) => render(file, 0, 0))

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

				<div className="fileItems">

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
				show={showDialogConfirmDeleteParams.show}				
			/>

		</div>
	);
}

export default Filesbar;
