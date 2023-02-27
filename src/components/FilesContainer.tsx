import { useContext } from "react";
import Filesbar from "./Filesbar/Filesbar";
import { AppContext, AppContextType } from "../Context";
import { files, typeFile } from "../types"
import { createFilenameAPI } from "../utils"
import "./FilesContainer.css";

const FilesContainer = () => {
	const {
		fileList,
		setFileList,

		activeFile,
		setActiveFile,
		renameFilename,
		deleteFile,
	} = useContext(AppContext) as AppContextType;


	const onFileCreate = async(fileName: string, type: typeFile, parentId: number): Promise<number> => {		
		let objFile: files = {id: 0, fileName: fileName, content: '', parentId: parentId}		
		if(type === 'folder') objFile = {...objFile, childNodes: []}
		
		try {
			const newFileId = await createFilenameAPI(objFile)	
			return newFileId
		} catch(e) {
			alert(e)
			throw new Error('API call for creating a file is failed')		
		}					
	}

	const onFileRename = async (fileId: number, newFilename: string): Promise<boolean> => {
		try {
			await renameFilename(fileId, newFilename)						
		} catch(e) {
			alert(e)
			return false			
		}
		return true	
	}

	const onFileDelete = async(fileId: number): Promise<boolean> => {
		try {
			await deleteFile(fileId)
			setActiveFile(undefined)						
		} catch(e) {
			alert(e)
			return false			
		}
		return true	
	}

	const onSelect = (fileId: number) => {
		setActiveFile(fileId)						
	}	

	return (
		<div className="filesContainer">
			<span>EXPLORER</span>
			<Filesbar
				title="Dmitriy's notes"
				fileList={fileList}
				selectedFile={activeFile}

				onFileCreate={onFileCreate}
				onFileRename={onFileRename}
				onFileDelete={onFileDelete}
				onSelect={onSelect}
			/>
		</div>
	);
};

export default FilesContainer;
