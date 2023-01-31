import React, { useState, useRef, useEffect } from "react";
import ContexMenu from "../ContexMenu";
import uuid from "react-uuid";
import FileItem from "./FileItem";
import "./Filesbar.css";

import { files } from "../../types";

interface FilesbarProps {
	title?: string;
	fileList: files;
	setFileList: (value: files) => void;
	activeFile?: string;
	setActiveFile: (value: string) => void;
	//onMenu: (e: React.MouseEvent<HTMLDivElement>, fileId: string) => void;
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
	const [newFileName, setNewFileName] = useState("");
	const [newFileError, setNewFileError] = useState("");

	const [showMenu, setShowMenu] = useState({
		show: false,
		x: 0,
		y: 0,
		fileId: "",
	});

	const inputRenameRef = useRef(null);

	const errorFileExists = (fileName: string) =>
		`A file or folder ${fileName} already exists at this location. Please choose a different name.`;

	const onKeyDownNewFile = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && newFileError === "") {
			if (newFileName !== "") {
				const fileId = uuid();
				setFileList({ ...fileList, [fileId]: newFileName });
				setNewFileName("");
				setShowInputNewFile(false);
			}
		}

		if (e.key === "Escape") {
			setShowInputNewFile(false);
			setNewFileName("");
			setNewFileError("");
		}
	};

	// const onKeyDownRenameFile = (e: React.KeyboardEvent<HTMLInputElement>) => {
	// 	if (e.key === "Enter" && newFileError === "") {
	// 		if (renameFileName.newName !== "") {
	// 			setFileList({
	// 				...fileList,
	// 				[renameFileName.fileId]: renameFileName.newName,
	// 			});
	// 			setRenameFileName({ fileId: "", newName: "" });
	// 		}
	// 	}

	// 	if (e.key === "Escape") {
	// 		setRenameFileName({ fileId: "", newName: "" });
	// 	}
	// };

	const onFileRenamed = (fileId: string, success: boolean, newFilename: string) => {
		setRenameFileName({ fileId: "", newName: "" });
		if (success) {
			setFileList({
				...fileList,
				[fileId]: newFilename,
			});			
		}
	}

	const onChangeNewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setNewFileName(value);
		if (value !== "") {
			const ifNotExists = Object.keys(fileList).every(
				(fileId) => fileList[fileId] !== value
			);
			!ifNotExists
				? setNewFileError(errorFileExists(value))
				: setNewFileError("");
		}
	};

	const onBlurNewFile = () => {
		setShowInputNewFile(false);
		setNewFileName("");
		setNewFileError("");
	};

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
		if (itemId === "EDIT_FILE") {
			setRenameFileName({ fileId: fileId, newName: fileList[itemId] });
			setTimeout(() => {
				//@ts-ignore
				if (inputRenameRef) inputRenameRef?.current?.select();
			}, 0);
		}

		if (itemId === "DELETE_FILE") {
			const copyFileList = { ...fileList };
			delete copyFileList[fileId];
			setFileList(copyFileList);
		}
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

				{Object.keys(fileList).map((fileId) => (
					<FileItem 
						fileId={fileId} 
						fileName={fileList[fileId]}
						selected={activeFile === fileId}
						focused={focused}
						editable={renameFileName.fileId === fileId}
						onClick={(fileId: string) => setActiveFile(fileId)}
						onMenu={(e, fileId) => onContextMenu(e, fileId)}
						onFileRenamed={onFileRenamed}
						key={fileId}
					/>

					// <div
					// 	onContextMenu={(e) => { e.stopPropagation(); onContextMenu(e, fileId)}}
					// 	className={
					// 		activeFile === fileId && focused
					// 			? "fileItem selectedFocusedFile"
					// 			: activeFile === fileId
					// 			? "fileItem selectedFile"
					// 			: "fileItem"
					// 	}
					// 	key={fileId}
					// >
					// 	<i className="fa-regular fa-file-lines"></i>

					// 	{
					// 		renameFileName.fileId === fileId ?
					// 		<input
					// 			type="text"
					// 			onClick={() => setActiveFile(fileId)}
					// 			value={renameFileName.newName}
					// 			onChange={(e) => setRenameFileName((prev) => ({...prev, fileId: fileId, newName: e.target.value}))}
					// 			onKeyDown={onKeyDownRenameFile}
					// 			onBlur={()=> {setRenameFileName({fileId: '', newName: ''}); setFileList({...fileList}) }}
					// 			style={{cursor: "auto"}}
					// 			ref={inputRenameRef}
					// 		/>
					// 		:
					// 		<input
					// 			readOnly
					// 			type="text"
					// 			onClick={() => setActiveFile(fileId)}
					// 			value={fileList[fileId]}
					// 			style={{userSelect: "none"}}

					// 		/>
					// 	}

					// </div>
				))}
			</div>

			{showInputNewFile && (
				<>
					<div className="wrapperNewFile">
						<i className="fa-regular fa-file-lines"></i>
						<input
							className={
								newFileError
									? "inputNewFile inputNewFileError"
									: "inputNewFile"
							}
							autoFocus
							value={newFileName}
							onChange={onChangeNewFile}
							type="text"
							onBlur={onBlurNewFile}
							onKeyDown={onKeyDownNewFile}
						/>
					</div>

					{newFileError && (
						<div className="errorNewFile">
							<span>{newFileError}</span>
						</div>
					)}
				</>
			)}

			{showMenu.show && (
				<ContexMenu
					showMenu={showMenu}
					onClickItem={onClickItem}
					setShowMenu={setShowMenu}
				/>
			)}
		</div>
	);
}

export default Filesbar;
