import React, { useState, useContext } from "react"
import { AppContext, AppContextType } from "../Context"
import { tabs } from "../types"
import EditorTabs from './EditorTabs'
import TextEditor from './TextEditor'
import ModalDialog2 from "./ModalDialog2"

function EditorContainer() {

	const { 
		tabs,
		setTabs,

		activeFile,
		setActiveFile,
		
		saveFileContent
	} = useContext(AppContext) as AppContextType;

    const [showDlgSaveFileWithParam, setShowDlgSaveFileWithParam] = useState({show: false, fileId: 0, fileName: ''})


    const onChangeTab = (tab: tabs | undefined) => {
        setActiveFile(tab?.id)
    }

    const onCloseTab = (tab: tabs) => {
        if(!tab.saved) {
            //setShowDlgSaveFileParams({fileId: fileToClose, fileName: objTab.tabName})
            //setShowDlgSaveFile(true)
            setShowDlgSaveFileWithParam({show: true, fileId: tab.id, fileName: tab.tabName})
            return false
        } else {
            //closeTab(fileToClose)
        }
    }

    const closeTab = (fileId: number) => {
		setTabs(tabs.filter((fileForClose) => fileForClose.id !== fileId));
		if (activeFile === fileId) onChangeTab && onChangeTab(undefined)//setActiveFile(undefined);		
	}   

    const onButtonClickModalDlgSaveFile = async (idButton: string) => {
		if(idButton === 'SAVE') {
			let content = tabs.find(item => item.id === activeFile)?.content
			content && await saveFileContent(showDlgSaveFileWithParam.fileId, content)
			closeTab(showDlgSaveFileWithParam.fileId)
            setShowDlgSaveFileWithParam({show: false, fileId: 0, fileName: ''})
		}

		if(idButton === 'DONTSAVE') {
			closeTab(showDlgSaveFileWithParam.fileId)
            setShowDlgSaveFileWithParam({show: false, fileId: 0, fileName: ''})
		}

		if(idButton === 'CANCEL') setShowDlgSaveFileWithParam({show: false, fileId: 0, fileName: ''})
		if(idButton === 'SYSCLOSE') setShowDlgSaveFileWithParam({show: false, fileId: 0, fileName: ''})      
	}   


	return (
        <>
            <EditorTabs 
                tabs={tabs}
                setTabs={setTabs} 
                activeFile={activeFile}  
                //setActiveFile={setActiveFile}
                saveFileContent={saveFileContent}             
                onChangeTab={onChangeTab}
                onCloseTab={onCloseTab}
            />
            <TextEditor
                tabs={tabs}
                setTabs={setTabs}
                activeFile={activeFile}
            />    
            <ModalDialog2
				title="Confirm"
				message={`Do you want to save the changes you made to '${showDlgSaveFileWithParam.fileName}'?`}
				faIcon="fa-regular fa-circle-question"
				buttons={[
					{ idButton: "SAVE", caption: "Save" },
					{ idButton: "DONTSAVE", caption: "Don't save" },
					{ idButton: "CANCEL", caption: "Cancel" },
				]}
				onButtonClick={onButtonClickModalDlgSaveFile}
				show={showDlgSaveFileWithParam.show}
				//setShow={setShowDlgSaveFile}					
			/>
        </>
    );
}

export default EditorContainer;
