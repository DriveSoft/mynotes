import { useContext } from "react";
import Filesbar from "./Filesbar/Filesbar";
import { AppContext, AppContextType } from "../Context";
import { files, typeFile } from "../types"
import { createFilenameAPI, updateFilenameAPI, deleteFilenameAPI } from "../utils"
import "./FilesContainer.css";

const FilesContainer = () => {
	const {
		fileList,
		activeFile,
		setActiveFile,
		tabs,
		setTabs
	} = useContext(AppContext) as AppContextType;


	const onFileCreate = async(fileName: string, type: typeFile, parentId: number): Promise<number> => {		
		let objFile: files = {id: 0, fileName: fileName, content: '', parentId: parentId}		
		if(type === 'folder') objFile = {...objFile, childNodes: []}
		
		try {
			const newFileId = await createFilenameAPI(objFile)
			return newFileId
		} catch(e) {
			alert('onFileCreate: ' + e)
			throw new Error('API call for creating a file has been failed')		
		}					
	}

	const onFileRename = async (fileObj: files): Promise<any> => {				
		try {
			await updateFilenameAPI(fileObj)
			setTabs(tabs.map(tab => fileObj.id === tab.id ? {...tab, tabName: fileObj.fileName} : tab))
		} catch(e) {
			alert('onFileRename: ' + e)
			throw new Error('API call for renaming a file has been failed')
		}			
	}

	const onFileDelete = async(fileId: number): Promise<any> => {
		try {
			await deleteFilenameAPI(fileId)
			setActiveFile(undefined)						
		} catch(e) {
			alert('onFileDelete: ' + e)
			throw new Error('API call for deleting a file has been failed')		
		}
	}

	const onSelect = (fileId: number) => {
		setActiveFile(fileId)						
	}	

	return (
		<div className="filesContainer">
			<span>EXPLORER</span>
			<Filesbar
				title="Dmitriy's notes"
				treeData={fileList}
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
