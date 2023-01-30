import React, { useState } from "react";

interface FilesbarProps {
	title?: string;
	fileList: string[];
	setFileList: (value: string[]) => void;
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
	const [newFileName, setNewFileName] = useState("");
	const [newFileError, setNewFileError] = useState("");

	const errorFileExists = (fileName: string) =>
		`A file or folder ${fileName} already exists at this location. Please choose a different name.`;

	const onKeyDownNewFile = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && newFileError === "") {
			if (newFileName !== "") {
				setFileList([...fileList, newFileName]);
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
			fileList.includes(value)
				? setNewFileError(errorFileExists(value))
				: setNewFileError("");
		}
	};

	const onBlurNewFile = () => {
		setShowInputNewFile(false);
		setNewFileName("");
		setNewFileError("");
	};

	return (
		<div
			className="filesbar"
			tabIndex={0}
			onFocus={() => setFocused(true)}
			onBlur={() => {
				setFocused(false);
			}}
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

				{/* <ul>
					{fileList.map((item: string) => (
						<li
							className={
								activeFile === item && focused
									? "selectedFocusedFile "
									: "" + activeFile === item
									? "selectedFile"
									: ""
							}
							onClick={() => setActiveFile(item)}
							key={item}
						>
							<i className="fa-regular fa-file-lines"></i>
							{item}
						</li>
					))}
				</ul> */}

				{fileList.map((item: string) => (
					<div
						className={
							activeFile === item && focused
								? "fileItem selectedFocusedFile"
								: activeFile === item
								? "fileItem selectedFile"
								: "fileItem"
						}
						key={item}
					>
						<i className="fa-regular fa-file-lines"></i>
						<input readOnly
							type="text"
							onClick={() => setActiveFile(item)}
							value={item}																	
						/>
					</div>
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
		</div>
	);
}

export default Filesbar;
