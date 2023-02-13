//https://codesandbox.io/s/upbeat-gould-st8dib?file=/src/App.tsx
import React, { useState, useEffect, useRef } from "react";

interface FileItemProps {
	fileId: number;
	fileName: string;
	//editable?: boolean;
	selected: boolean;
	focused?: boolean;
    //isNewFile?: boolean;
    mode?: 'NEW_FILE' | 'RENAME_FILE';
	onClick?: (fileId: number) => void;
	onMenu: (e: React.MouseEvent<HTMLDivElement>, fileId: number) => void;
    onFileCreated?: (success: boolean, filename: string, inputEl: any) => void;
    onFileRenamed?: (fileId: number, success: boolean, newFilename: string, inputEl: any) => void;
	onChangeValidator: (fileId: number, fileName: string, inputEl: any) => boolean;
}

function FileItem({
	fileId,
	fileName,
	//editable,
	selected,
	focused,
    //isNewFile,
    mode,
	onClick,
	onMenu,
    onFileCreated,
    onFileRenamed,
    onChangeValidator
}: FileItemProps) {
	const [renameFilename, setRenameFilename] = useState(fileName)
    const [isValid, setIsValid] = useState(true)

    const inputEl = useRef(null)

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && isValid) {
			if (renameFilename !== "") {
                mode === 'RENAME_FILE' && onFileRenamed && onFileRenamed(fileId, true, renameFilename, inputEl)
                mode === 'NEW_FILE' && onFileCreated && onFileCreated(true, renameFilename, inputEl)
			}
		}

		if (e.key === "Escape") {
			setRenameFilename(fileName);
            mode === 'RENAME_FILE' && onFileRenamed && onFileRenamed(fileId, false, '', inputEl)
            mode === 'NEW_FILE' && onFileCreated && onFileCreated(false, '', inputEl)
		}
	};

    const onBlur = () => {
        setRenameFilename(fileName);
        mode === 'RENAME_FILE' && onFileRenamed && onFileRenamed(fileId, false, '', inputEl)
        mode === 'NEW_FILE' && onFileCreated && onFileCreated(false, '', inputEl)
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setRenameFilename(value)
        setIsValid(onChangeValidator(fileId, value, inputEl))     
    }


    useEffect(()=>{
        //@ts-ignore
        //if ((editable || isNewFile) && inputEl) inputEl?.current?.select();
        if (mode && inputEl) inputEl?.current?.select();
    }, [mode])


	return (
		<div
			onContextMenu={(e) => {
				e.stopPropagation();
				onMenu(e, fileId);
			}}
			className={
				selected && focused
					? "fileItem selectedFocusedFile"
					: selected
					? "fileItem selectedFile"
					: "fileItem"
			}
			key={fileId}
		>
			<i className="fa-regular fa-file-lines"></i>

			{mode === 'RENAME_FILE' ? (
				<input
					type="text"
					onClick={() => onClick && onClick(fileId)}
					value={renameFilename}
					onChange={onChange}
					onKeyDown={onKeyDown}
					onBlur={onBlur}
					style={{ cursor: "auto", zIndex: "2" }}
					ref={inputEl}
				/>
			) : mode === 'NEW_FILE' ? (
				<input
					type="text"
					value={renameFilename}
					onChange={onChange}
					onKeyDown={onKeyDown}
					onBlur={onBlur}
					style={{ cursor: "auto", zIndex: "2" }}
					ref={inputEl}
				/>
            ) : (
				<input
					readOnly
					type="text"
					onClick={() => onClick && onClick(fileId)}
					value={fileName}
					style={{ userSelect: "none" }}
				/>
			)}
		</div>
	);
}

export default FileItem;
