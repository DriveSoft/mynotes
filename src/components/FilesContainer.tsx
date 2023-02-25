import { useContext } from "react";
import Filesbar from "./Filesbar/Filesbar";
import { AppContext, AppContextType } from "../Context";
import { files, typeFile } from "../types"
import "./FilesContainer.css";

const FilesContainer = () => {
	const {
		fileList,
		setFileList,

		activeFile,
		setActiveFile,

		createNewFile,
		renameFilename,
		deleteFile,
	} = useContext(AppContext) as AppContextType;


	const onFileCreate = async(fileName: string, type: typeFile, parentId: number): Promise<boolean> => {		
		try {
			await createNewFile(fileName, parentId, type)						
		} catch(e) {
			alert(e)
			return false			
		}
		return true				
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

	return (
		<div className="filesContainer">
			<span>EXPLORER</span>
			<Filesbar
				title="Dmitriy's notes"
				fileList={fileList}
				setFileList={setFileList}
				activeFile={activeFile}
				setActiveFile={setActiveFile}
				createNewFile={createNewFile}
				renameFilename={renameFilename}
				deleteFile={deleteFile}

				onFileCreate={onFileCreate}
				onFileRename={onFileRename}
				onFileDelete={onFileDelete}
			/>
		</div>
	);
};

export default FilesContainer;
