import React, { useState, createContext } from "react";
import {
	sortFiles,
	createFilenameAPI,
	deleteFilenameAPI,
	saveFileContentToApiAndGetUpdatedState,
	renameFilenameToApiAndGetUpdatedState
} from "./utils";
import { files, tabs } from "./types";

export const AppContext = createContext<AppContextType | null>(null);

export type AppContextType = {
	fileList: files[];
	setFileList: (value: files[]) => void;

	activeFile: number | undefined;
	setActiveFile: (value: number | undefined) => void;

	tabs: tabs[];
	setTabs: (value: tabs[]) => void;

	//createFile: (fileName: string) => Promise<boolean>;
	createFile: (fileName: string) => void
	deleteFile: (fileId: number) => Promise<boolean>;
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

		createFile, 
		deleteFile,
		saveFileContent,
		renameFilename
	}

	// function createFile (fileName: string): Promise<boolean> {
	// 	return new Promise( async(resolve, reject) => {
	// 		const newId = getNewId(fileList)

	// 		if (await createFilenameAPI({id: newId, fileName: fileName, content: '', parentId: 0})) {
	// 			setFileList(
	// 				sortFiles([
	// 					...fileList,
	// 					{ id: newId, fileName: fileName, content: "", parentId: 0, childNodes:[], isOpened: false },
	// 				])
	// 			);
	// 			setActiveFile(newId);				
	// 			resolve(true)				
	// 		}	
	// 		reject('Error createFile')		
	// 	})
	// };

	async function createFile (fileName: string) {
			const newId = getNewId(fileList)

			if (await createFilenameAPI({id: newId, fileName: fileName, content: '', parentId: 0})) {
				setFileList(
					sortFiles([
						...fileList,
						{ id: newId, fileName: fileName, content: "", parentId: 0 }, //, childNodes:[], isOpened: false
					])
				);
				setActiveFile(newId)							
			}	
	};

	async function deleteFile (fileId: number): Promise<boolean> {//: Promise<boolean>

		if (await deleteFilenameAPI(fileId)) {
			const newFileList = fileList.filter(item => item.id !== fileId)
			setFileList(newFileList)
			return true
		} 
		
		return false
	};	


	async function saveFileContent(idFile: number, content: string) {
		const newFileList = await saveFileContentToApiAndGetUpdatedState(fileList, idFile, content)
		if (newFileList) {
			newFileList && setFileList(newFileList)
			savedStatusOfFile(idFile, true)			
		}
	};

	async function renameFilename(idFile: number, newFilename: string) {
		const newFileList = await renameFilenameToApiAndGetUpdatedState(fileList, idFile, newFilename)
		if (newFileList) {
			newFileList && setFileList(newFileList)				
		}
	};


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
