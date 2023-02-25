import React, { useState, createContext } from "react";
import {
	sortFiles,
	createFilenameAPI,
	deleteFilenameAPI,
	saveFileContentToApiAndGetUpdatedState,
	renameFilenameToApiAndGetUpdatedState,
	createFileAndUpdateFileList,
	deleteFileAndUpdateFileList
} from "./utils";
import { files, tabs, typeFile } from "./types";

export const AppContext = createContext<AppContextType | null>(null);

export type AppContextType = {
	fileList: files[];
	setFileList: (value: files[]) => void;

	activeFile: number | undefined;
	setActiveFile: (value: number | undefined) => void;

	tabs: tabs[];
	setTabs: (value: tabs[]) => void;

	createNewFile: (fileName: string, parentId: number, typeFile: typeFile) => Promise<any>
	deleteFile: (fileId: number) => Promise<any>;
	saveFileContent: (idFile: number, content: string) => Promise<any>
	renameFilename: (idFile: number, newFilename: string) => Promise<any>
};

interface AppProviderProps {
	children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {

	const [fileList, setFileList] = useState<files[]>([]);
	const [activeFile, setActiveFile] = useState<number | undefined>(undefined);
	const [tabs, setTabs] = useState<tabs[]>([]);

	const value = { 
		fileList, 
		setFileList, 

		activeFile,
		setActiveFile,
		
		tabs,
		setTabs,

		createNewFile, 
		deleteFile,
		saveFileContent,
		renameFilename
	}


	async function createNewFile(fileName: string, parentId: number, typeFile: typeFile): Promise<any> {		
		let objFile: files = {id: 0, fileName: fileName, content: '', parentId: parentId}		
		if(typeFile === 'folder') objFile = {...objFile, childNodes: []}
		const newId = await createFilenameAPI(objFile)
		
		if (newId) {
			const newFileList = createFileAndUpdateFileList(fileList, newId, parentId, fileName, typeFile)
			setFileList(newFileList)		
			setActiveFile(newId)
			console.log(newFileList)
		}
	}	

	async function deleteFile (fileId: number): Promise<any> {
		await deleteFilenameAPI(fileId)
		const newFileList = deleteFileAndUpdateFileList(fileList, fileId)
		setFileList(newFileList)	
	};	


	async function saveFileContent(idFile: number, content: string) {
		const newFileList = await saveFileContentToApiAndGetUpdatedState(fileList, idFile, content)
		if (newFileList) {
			newFileList && setFileList(newFileList)
			savedStatusOfFile(idFile, true)			
		}
	}

	async function renameFilename(idFile: number, newFilename: string) {
		const newFileList = await renameFilenameToApiAndGetUpdatedState(fileList, idFile, newFilename)
		if (newFileList) {
			newFileList && setFileList(newFileList)				
		}
	}


	function savedStatusOfFile(idFile: number, saved: boolean) {
		const newTabs = tabs.map((tab) =>
			tab.id === idFile ? { ...tab, saved: true } : tab
		);
		setTabs(newTabs);
	}	


	function getNewId(files: files[]): number {
		return files.reduce((acc, item) => item.id > acc ? item.id : acc, 0 )+1
	}

	return (
		<AppContext.Provider value={value}>			
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;
