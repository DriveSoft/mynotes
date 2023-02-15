import React, { useState, useRef, useContext } from "react";
import { AppContext, AppContextType } from "../../Context";
import ContexMenu from "../ContexMenu";
import ModalDialog from "../ModalDialog";
import FileItem from "./FileItem";
import { files, fileType } from "../../types";
import "./Filesbar.css";


interface FilesbarProps {
	title?: string;
}

function Filesbar({title}: FilesbarProps) {

	const { 
		fileList, 
		setFileList, 

		activeFile,
		setActiveFile,
		
		createFile, 
		renameFilename,
		deleteFile
			
	} = useContext(AppContext) as AppContextType;

	const [focused, setFocused] = useState(false)
	const [showInputNewFile, setShowInputNewFile] = useState(false)
	const [renameFileName, setRenameFileName] = useState({
		fileId: 0,
		newName: "",
	});

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
		`A file or folder ${fileName} already exists at this location. Please choose a different name.`;

	const onFileRenamed = async(
		fileId: number,
		success: boolean,
		newFilename: string,
		inputEl: any
	) => {		
		setError({ error: '', left: 0, top: 0, width: 0 });	
		inputEl.current.style.outline = "";
		
		if (success) {					
			try {
				//await updateFile({...objFile, fileName: newFilename, parentId: 0})								
				await renameFilename(fileId, newFilename)
				setRenameFileName({ fileId: 0, newName: "" })
			} catch(e) {					
				alert(e)
			}
					
		} else {
			setRenameFileName({ fileId: 0, newName: "" });
		}
	};

	const onFileCreated = async(success: boolean, filename: string, inputEl: any) => {
		setError({ error: '', left: 0, top: 0, width: 0 });	
		inputEl.current.style.outline = "1px solid #252525";

		if (success) {
			try {
				await createFile(filename)
				setShowInputNewFile(false)
			} catch(e) {
				alert(e)
			}
		} else {
			setShowInputNewFile(false)
		}				
	}

	const onContextMenu = (
		e: React.MouseEvent<HTMLDivElement>,
		fileId: number
	) => {
		e.preventDefault();
		setShowMenu({
			show: true,
			x: e.pageX,
			y: e.pageY,
			fileId: fileId,
		});
	};


	const onClickItem = async(fileId: number, itemId: string) => {
		if (itemId === "NEW_FILE") {
			setShowInputNewFile(true)
		}
				
		if (itemId === "EDIT_FILE") {
			const fileName = fileList.find((item) => item.id === fileId)?.content || ''
			setRenameFileName({fileId: fileId, newName: fileName })
			setTimeout(() => {
				//@ts-ignore
				if (inputRenameRef) inputRenameRef?.current?.select()
			}, 0);
		}

		if (itemId === "DELETE_FILE") {			
			const fileObj = fileList.find(item => item.id === fileId)
			setShowDialogConfirmDeleteParams({fileId: fileId, fileName: fileObj?.fileName || ''})
			setShowDialogConfirmDelete(true)
		}
	};


	const onButtonClickModalDlgConfirmDelete = async(idButton: string) => {
		if(idButton === 'DELETE') {
			try {
				if (await deleteFile(showDialogConfirmDeleteParams.fileId)) {
					const newFileList = fileList.filter(item => item.id !== showDialogConfirmDeleteParams.fileId)
					setFileList(newFileList)
				} 
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
			inputEl.current.style.outline = "1px solid red";
			const elRect = inputEl.current.getBoundingClientRect();
			setError({
				error: errorFileExists(fileName),
				left: elRect.left-1,
				top: elRect.bottom - 1,
				//width: elRect.right - elRect.left + 2,
				width: inputEl?.current?.offsetWidth+2 ?? 0
			});
		} else {
			inputEl.current.style.outline = "";
			setError({ error: '', left: 0, top: 0, width: 0 });			
		}

		return result;			
	};


	const onClickFileItem = (fileId: number) => {
		setActiveFile(fileId)	
		console.log(fileId)
	}

	const renderFiles = (file: files, level: number) => {

		if(file?.childNodes) {
			return (
				<FileItem
					fileObj={file}
					fileId={file.id}
					fileName={file.fileName}
					fileType={'FOLDER'}
					selected={activeFile === file.id}
					focused={focused}
					mode={renameFileName.fileId === file.id ? 'RENAME_FILE' : undefined}
					onClick={onClickFileItem}
					onMenu={(e, fileId) => onContextMenu(e, fileId)}
					onFileRenamed={onFileRenamed}
					onChangeValidator={onChangeValidator}
					key={file.id}
					level={level}					
				>	
					{						
						file.childNodes.map((file: any) => renderFiles(file, level+1))
					}
				</FileItem>	
			)
		}


		return (
			<FileItem
				fileObj={file}
				fileId={file.id}
				fileName={file.fileName}
				fileType={'FILE'}
				selected={activeFile === file.id}
				focused={focused}
				mode={renameFileName.fileId === file.id ? 'RENAME_FILE' : undefined}
				onClick={onClickFileItem}
				onMenu={(e, fileId) => onContextMenu(e, fileId)}
				onFileRenamed={onFileRenamed}
				onChangeValidator={onChangeValidator}
				key={file.id}
				level={level}
			/>			
		)
	}
	

	return (
		<div
			className="filesbar"
			tabIndex={0}
			onFocus={() => setFocused(true)}
			onBlur={() => {
				setFocused(false);
			}}
			onContextMenu={(e) => onContextMenu(e, 0)}
		>
			<span>EXPLORER</span>
			<div className="files">
				<div className="filesTitle">
					{title && <span>{title}</span>}
					<i
						className="fa-regular fa-file"
						onClick={() => setShowInputNewFile(true)}
					></i>
				</div>

				<div style={{ position: "relative" }}>

					{ showInputNewFile && 
						<FileItem
							fileObj={{id: 0, fileName: '', content: '', parentId: 0}}	
							fileId={0}
							fileName={''}
							fileType='FILE'
							selected={false}
							focused={focused}		
							//isNewFile={true}	
							mode='NEW_FILE'			
							onMenu={(e, fileId) => onContextMenu(e, fileId)}
							onFileCreated={onFileCreated}
							onChangeValidator={onChangeValidator}
							key={'newFile'}
							level={0}
					/>
					}


					{fileList.map((file: any) => renderFiles(file, 0))}


					{(renameFileName.fileId !== 0 || showInputNewFile) && (
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
