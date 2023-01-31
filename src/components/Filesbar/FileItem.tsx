import React, { useState, useEffect, useRef } from "react";

interface FileItemProps {
	fileId: string;
	fileName: string;
	editable?: boolean;
	selected: boolean;
	focused?: boolean;
	onClick: (fileId: string) => void;
	onMenu: (e: React.MouseEvent<HTMLDivElement>, fileId: string) => void;
    onFileRenamed: (fileId: string, success: boolean, newFilename: string) => void;
	//onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function FileItem({
	fileId,
	fileName,
	editable,
	selected,
	focused,
	onClick,
	onMenu,
    onFileRenamed
}: FileItemProps) {
	const [renameFilename, setRenameFilename] = useState(fileName)
    const [error, setError] = useState('')

    const inputEl = useRef(null)

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && error === "") {
			if (renameFilename !== "") {
                onFileRenamed(fileId, true, renameFilename)
			}
		}

		if (e.key === "Escape") {
			setRenameFilename(fileName);
            onFileRenamed(fileId, false, '')
		}
	};

    const onBlur = () => {
        setRenameFilename(fileName);
        onFileRenamed(fileId, false, '')
    }

    useEffect(()=>{
        //@ts-ignore
        if (editable && inputEl) inputEl?.current?.select();
    }, [editable])

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

			{editable ? (
				<input
					type="text"
					onClick={() => onClick(fileId)}
					value={renameFilename}
					onChange={(e) => setRenameFilename(e.target.value)}
					onKeyDown={onKeyDown}
					onBlur={onBlur}
					style={{ cursor: "auto" }}
					ref={inputEl}
				/>
			) : (
				<input
					readOnly
					type="text"
					onClick={() => onClick(fileId)}
					value={fileName}
					style={{ userSelect: "none" }}
				/>
			)}
		</div>
	);
}

export default FileItem;
