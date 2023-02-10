import React, { useState, createContext } from "react";
import uuid from "react-uuid";
import {
	sortFiles,
	createFilenameAPI,
	updateFilenameAPI,
	deleteFilenameAPI,
} from "./utils";
import { files, tabs } from "./types";

export const AppContext = createContext<AppContextType | null>(null);

export type AppContextType = {
	fileList: files[];
	setFileList: (value: files[]) => void;

	activeFile: string | undefined;
	setActiveFile: (value: string | undefined) => void;

	tabs: tabs[];
	setTabs: (value: tabs[]) => void;

	createFile: (fileName: string) => Promise<boolean>;
	updateFile: (file: files) => Promise<boolean>;
	deleteFile: (fileId: string) => Promise<boolean>;
};

interface AppProviderProps {
	children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {

	const [fileList, setFileList] = useState<files[]>([]);
	const [activeFile, setActiveFile] = useState<string | undefined>(undefined);
	const [tabs, setTabs] = useState<tabs[]>([]);

	const value = { 
		fileList, 
		setFileList, 

		activeFile,
		setActiveFile,
		
		tabs,
		setTabs,

		createFile, 
		updateFile,
		deleteFile
	}

	function createFile (fileName: string): Promise<boolean> {
		return new Promise( async(resolve, reject) => {
			const newId = uuid()
			if (await createFilenameAPI(newId, fileName)) {
				setFileList(
					sortFiles([
						...fileList,
						{ id: newId, fileName: fileName, content: "" },
					])
				);
				setActiveFile(newId);				
				resolve(true)				
			}	
			reject('Error createFile')		
		})
	};

	function updateFile(updatedfile: files): Promise<boolean> {
		return new Promise(async(resolve, reject) => {
			const newFileList = sortFiles(
				fileList.map((item) => {
					if (item.id === updatedfile.id) {
						return updatedfile;
					} else {
						return item;
					}
				})
			);

			const result = await updateFilenameAPI(updatedfile.id, updatedfile.fileName, updatedfile.content)
			if (result) {				
				setFileList(newFileList);	
				resolve(true)			
			}
			
			reject('updateFile error')
		})
	};

	async function deleteFile (fileId: string): Promise<boolean> {//: Promise<boolean>

		if (await deleteFilenameAPI(fileId)) {
			const newFileList = fileList.filter(item => item.id !== fileId)
			setFileList(newFileList)
			return true
		} 
		
		return false
	};	

	return (
		<AppContext.Provider value={value}>			
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;
