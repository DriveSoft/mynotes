import React, { useContext } from "react";
import { AppContext, AppContextType } from "../Context";
import EditorTabs from './EditorTabs'
import TextEditor from './TextEditor'

function EditorContainer() {

	const { 
		tabs,
		setTabs,

		activeFile,
		setActiveFile,
		
		saveFileContent
	} = useContext(AppContext) as AppContextType;


	return (
        <>
            <EditorTabs 
                tabs={tabs}
                setTabs={setTabs} 
                activeFile={activeFile}  
                setActiveFile={setActiveFile}
                saveFileContent={saveFileContent}             
            />
            <TextEditor
                tabs={tabs}
                setTabs={setTabs}
                activeFile={activeFile}
            />    
        </>
    );
}

export default EditorContainer;
