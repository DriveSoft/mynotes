//https://codesandbox.io/s/upbeat-gould-st8dib?file=/src/App.tsx
import React, { useState, useEffect, useRef } from "react";
import { files, fileType } from "../../types"

interface FileItemProps {
	fileObj: files
	selected: boolean
	focused?: boolean
    mode?: 'NEW_FILE' | 'RENAME_FILE'
	onClick?: (file: files) => void
	onMenu?: (e: React.MouseEvent<HTMLDivElement>, fileId: number) => void
    onFileCreated?: (success: boolean, filename: string, inputEl: any) => void
	onFileRenamed?: (fileObj: files, success: boolean, inputEl: any) => void
	onChangeValidator: (fileId: number, fileName: string, inputEl: any) => boolean
	children?: React.ReactNode
	level: number
}

function FileItem({
	fileObj,
	selected,
	focused,
    mode,
	onClick,
	onMenu,
    onFileCreated,
    onFileRenamed,
    onChangeValidator,
	children,
	level
}: FileItemProps) {
	const [renameFilename, setRenameFilename] = useState(fileObj.fileName);
	const [isValid, setIsValid] = useState(true);
	const fileType: fileType = fileObj?.childNodes ? "FOLDER" : "FILE";

	const inputEl = useRef(null);

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && isValid) {
			if (renameFilename !== "") {
				mode === "RENAME_FILE" &&
					onFileRenamed &&
					//onFileRenamed(fileObj.id, true, renameFilename, inputEl);
					onFileRenamed({...fileObj, fileName: renameFilename}, true, inputEl)
				mode === "NEW_FILE" &&
					onFileCreated &&
					onFileCreated(true, renameFilename, inputEl);
			}
		}

		if (e.key === "Escape") {
			setRenameFilename(fileObj.fileName);
			mode === "RENAME_FILE" &&
				onFileRenamed &&
				onFileRenamed(fileObj, false, inputEl)
			mode === "NEW_FILE" &&
				onFileCreated &&
				onFileCreated(false, "", inputEl);
		}
	};

	const onBlur = () => {
		setRenameFilename(fileObj.fileName);
		mode === "RENAME_FILE" &&
			onFileRenamed &&
			onFileRenamed(fileObj, false, inputEl)
		mode === "NEW_FILE" &&
			onFileCreated &&
			onFileCreated(false, "", inputEl);
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setRenameFilename(value);
		setIsValid(onChangeValidator(fileObj.id, value, inputEl))
	};

	useEffect(() => {
		//@ts-ignore
		if (mode && inputEl) inputEl?.current?.select();
	}, [mode]);

	const paddingLeftTree = `${25 + level * 10}px`;

	interface FileIconProps {
		type: fileType;
		isOpened: boolean;
	}
	function FileIcon({ type, isOpened }: FileIconProps) {		
		return (
			<>
				{type === "FOLDER" ? (
					<>
						{isOpened ? (
							<>
								<i className="fa-solid fa-chevron-down" data-testid={'arrow'} style={{width: "14px"}}></i>
								<i className="fa-regular fa-folder-open" data-testid={'icon'}></i>
							</>
						) : (
							<>
								<i className="fa-solid fa-chevron-right" data-testid={'arrow'} style={{width: "14px"}}></i>
								<i className="fa-regular fa-folder" data-testid={'icon'}></i>
							</>
						)}
					</>
				) : (
					<i className="fa-regular fa-file" data-testid={'icon'} style={{paddingLeft: "18px"}}></i>
				)}
			</>
		);
	}
//<i class="fa-regular fa-folder-open"></i>
	return (
		<div role="listitem">
			<div
				onClick={() => mode !== "RENAME_FILE" && onClick && onClick(fileObj)}
				onContextMenu={(e) => {
					e.stopPropagation();
					onMenu && onMenu(e, fileObj.id);
				}}
				className={
					selected && focused
						? "fileItem selectedFocusedFile"
						: selected
						? "fileItem selectedFile"
						: "fileItem"
				}
				style={{ paddingLeft: paddingLeftTree }}
			>
				{/* {fileType === 'FOLDER' ? <><i className="fa-solid fa-chevron-right"></i><i className="fa-regular fa-folder"></i></> : <i className="fa-regular fa-file-lines"></i>} */}
				<FileIcon
					type={fileType}
					isOpened={fileObj?.isOpened || false}
				/>

				{mode === "RENAME_FILE" ? (
					<input
						type="text"
						//onClick={() => onClick && onClick(fileObj)}
						value={renameFilename}
						onChange={onChange}
						onKeyDown={onKeyDown}
						onBlur={onBlur}
						style={{ cursor: "auto", zIndex: "2" }}
						ref={inputEl}
					/>
				) : mode === "NEW_FILE" ? (
					<input
						type="text"
						value={renameFilename}
						onChange={onChange}
						onKeyDown={onKeyDown}
						onBlur={onBlur}
						style={{ cursor: "auto", zIndex: "2" }}
						ref={inputEl}
						aria-label="Enter a file name"
					/>
				) : (
					<input
						readOnly
						type="text"
						//onClick={() => onClick && onClick(fileObj)}
						value={fileObj.fileName}
						style={{ userSelect: "none" }}
					/>
				)}				
			</div>

			{children}
			
		</div>
	);
}

export default FileItem;
