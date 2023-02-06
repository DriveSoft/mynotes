import React, { useState, useRef, useEffect } from "react";
import ContexMenu from "../ContexMenu";
import uuid from "react-uuid";
import { sortFiles } from "../../utils"
import FileItem from "./FileItem";
import "./Filesbar.css";

import { files } from "../../types";

interface FilesbarProps {
	title?: string;
	fileList: files[];
	setFileList: (value: files[]) => void;
	activeFile?: string;
	setActiveFile: (value: string) => void;
}

function Filesbar({
	title,
	fileList,
	setFileList,
	activeFile,
	setActiveFile,
	
}: FilesbarProps) {
	const [focused, setFocused] = useState(false);
	const [showInputNewFile, setShowInputNewFile] = useState(false);
	const [renameFileName, setRenameFileName] = useState({
		fileId: "",
		newName: "",
	});

	const [error, setError] = useState({
		error: "",
		left: 0,
		top: 0,
		width: 0,
	});

	const [showMenu, setShowMenu] = useState({
		show: false,
		x: 0,
		y: 0,
		fileId: "",
	});

	const inputRenameRef = useRef(null);

	const errorFileExists = (fileName: string) =>
		`A file or folder ${fileName} already exists at this location. Please choose a different name.`;

	const onFileRenamed = (
		fileId: string,
		success: boolean,
		newFilename: string,
		inputEl: any
	) => {
		setError({ error: '', left: 0, top: 0, width: 0 });	
		inputEl.current.style.outline = "";

		setRenameFileName({ fileId: "", newName: "" });
		if (success) {			
			setFileList( sortFiles(fileList.map(item => {
				if (item.id === fileId) {
					return {...item, fileName: newFilename}
				} else {
					return item
				}
			})) )
		}
	};

	const onFileCreated = (success: boolean, filename: string, inputEl: any) => {
		setError({ error: '', left: 0, top: 0, width: 0 });	
		inputEl.current.style.outline = "1px solid #252525";

		if (success) {
			const newId = uuid()
			//setFileList( sortFiles({ ...fileList, [newId]: filename}) )
			setFileList(sortFiles([...fileList, {id: newId, fileName: filename, content: ''}]))
			setActiveFile(newId)
		}
		
		setShowInputNewFile(false)
	}

	const onContextMenu = (
		e: React.MouseEvent<HTMLDivElement>,
		fileId: string
	) => {
		e.preventDefault();
		setShowMenu({
			...showMenu,
			show: true,
			x: e.pageX,
			y: e.pageY,
			fileId: fileId,
		});
	};

	const onClickItem = (fileId: string, itemId: string) => {
		if (itemId === "NEW_FILE") {
			setShowInputNewFile(true)
		}
				
		if (itemId === "EDIT_FILE") {
			const fileName = fileList.find((item) => item.id === fileId)?.content || '';
			setRenameFileName({fileId: fileId, newName: fileName })
			setTimeout(() => {
				//@ts-ignore
				if (inputRenameRef) inputRenameRef?.current?.select();
			}, 0);
		}

		if (itemId === "DELETE_FILE") {
			const newFileList = fileList.filter(item => item.id !== fileId)
			setFileList(newFileList);
		}
	};

	const onChangeValidator = (
		fileId: string,
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
				width: elRect.right - elRect.left + 2,
			});
		} else {
			inputEl.current.style.outline = "";
			setError({ error: '', left: 0, top: 0, width: 0 });			
		}

		return result;		
	
	};

	return (
		<div
			className="filesbar"
			tabIndex={0}
			onFocus={() => setFocused(true)}
			onBlur={() => {
				setFocused(false);
			}}
			onContextMenu={(e) => onContextMenu(e, "")}
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
							fileId={''}
							fileName={''}
							selected={false}
							focused={focused}		
							//isNewFile={true}	
							mode='NEW_FILE'			
							onMenu={(e, fileId) => onContextMenu(e, fileId)}
							onFileCreated={onFileCreated}
							onChangeValidator={onChangeValidator}
							key={'newFile'}
					/>
					}

					{fileList.map((item) => (
						<FileItem
							fileId={item.id}
							fileName={item.fileName}
							selected={activeFile === item.id}
							focused={focused}
							mode={renameFileName.fileId === item.id ? 'RENAME_FILE' : undefined}
							onClick={(fileId: string) => setActiveFile(fileId)}
							onMenu={(e, fileId) => onContextMenu(e, fileId)}
							onFileRenamed={onFileRenamed}
							onChangeValidator={onChangeValidator}
							key={item.id}
						/>
					))}


					{(renameFileName.fileId !== "" || showInputNewFile) && (
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
		</div>
	);
}

export default Filesbar;
