import React, { useState } from "react";
import ContexMenu from "./ContexMenu"
import uuid from 'react-uuid';
import { files } from "../types";

interface FilesbarProps {
	title?: string;
	fileList: files;
	setFileList: (value: files) => void;
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
	const [renameFileName, setRenameFileName] = useState("");
	const [newFileName, setNewFileName] = useState("");
	const [newFileError, setNewFileError] = useState("");

	const [showMenu, setShowMenu] = useState({show: false, x: 0, y: 0, fileId: ''});

	const errorFileExists = (fileName: string) =>
		`A file or folder ${fileName} already exists at this location. Please choose a different name.`;

	const onKeyDownNewFile = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && newFileError === "") {
			if (newFileName !== "") {
				const fileId = uuid();
				setFileList({...fileList, [fileId]: renameFileName});
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

	const onChangeNewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setNewFileName(value);
		if (value !== "") {
			const ifNotExists = Object.keys(fileList).every(fileId => fileList[fileId] !== value)
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

	const onContextMenu = (e: React.MouseEvent<HTMLDivElement>, fileId: string) => {
		e.preventDefault();
		setShowMenu({...showMenu, show: true, x: e.pageX, y: e.pageY, fileId: fileId});
	}

	const onClickItem = (fileId: string, itemId: string) => {
		console.log(fileId, itemId)
	}

	return (
		<div
			className="filesbar"
			tabIndex={0}
			onFocus={() => setFocused(true)}
			onBlur={() => {
				setFocused(false);
			}}	
			onContextMenu={(e) => onContextMenu(e, '')}		
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
					<div
						onContextMenu={(e) => { e.stopPropagation(); onContextMenu(e, fileId)}}
						className={
							activeFile === fileId && focused
								? "fileItem selectedFocusedFile"
								: activeFile === fileId
								? "fileItem selectedFile"
								: "fileItem"
						}
						key={fileId}
					>
						<i className="fa-regular fa-file-lines"></i>
						<input							
							readOnly
							type="text"
							onClick={() => setActiveFile(fileId)}
							value={fileList[fileId]}
							onChange={(e) => setRenameFileName(e.target.value)}
						/>
					</div>
				))
				}

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

			{ showMenu.show && <ContexMenu showMenu={showMenu} onClickItem={onClickItem} setShowMenu={setShowMenu} /> }
		</div>
	);
}

export default Filesbar;
