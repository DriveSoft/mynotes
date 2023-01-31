import React, { useState, useEffect, useRef } from "react";

interface FileItemProps {
	fileId: string;
	fileName: string;
	editable?: boolean;
	selected: boolean;
	focused?: boolean;
	onClick: (fileId: string) => void;
	onMenu: (e: React.MouseEvent<HTMLDivElement>, fileId: string) => void;
    onFileRenamed: (fileId: string, success: boolean, newFilename: string, inputEl: any) => void;
	onChangeValidator: (fileId: string, fileName: string, inputEl: any) => boolean;
}

function FileItem({
	fileId,
	fileName,
	editable,
	selected,
	focused,
	onClick,
	onMenu,
    onFileRenamed,
    onChangeValidator
}: FileItemProps) {
	const [renameFilename, setRenameFilename] = useState(fileName)
    const [isValid, setIsValid] = useState(true)

    const inputEl = useRef(null)

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && isValid) {
			if (renameFilename !== "") {
                onFileRenamed(fileId, true, renameFilename, inputEl)
			}
		}

		if (e.key === "Escape") {
			setRenameFilename(fileName);
            onFileRenamed(fileId, false, '', inputEl)
		}
	};

    const onBlur = () => {
        setRenameFilename(fileName);
        onFileRenamed(fileId, false, '', inputEl)
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setRenameFilename(value)
        setIsValid(onChangeValidator(fileId, value, inputEl))     
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
					onClick={() => onClick(fileId)}
					value={fileName}
					style={{ userSelect: "none" }}
				/>
			)}
		</div>
	);
}

export default FileItem;
