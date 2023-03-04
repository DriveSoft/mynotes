import React, { useState, createContext } from "react";
import { saveFileContentToApiAndGetUpdatedState } from "./utils";
import { files, tabs, typeFile } from "./types";

export const AppContext = createContext<AppContextType | null>(null);

export type AppContextType = {
	fileList: files[];
	setFileList: (value: files[]) => void;

	activeFile: number | undefined;
	setActiveFile: (value: number | undefined) => void;

	tabs: tabs[];
	setTabs: (value: tabs[]) => void;

	saveFileContent: (idFile: number, content: string) => Promise<any>
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

		saveFileContent,
	}

	
	async function saveFileContent(idFile: number, content: string) {		
		const newFileList = await saveFileContentToApiAndGetUpdatedState(fileList, idFile, content)
		
		if (newFileList) {
			newFileList && setFileList(newFileList)
			savedStatusOfFile(idFile, true)				
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
