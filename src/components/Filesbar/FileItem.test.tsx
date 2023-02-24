import { render, screen } from "@testing-library/react";
import FileItem from "./FileItem";
import { files, fileType } from "../../types"
import { debug } from "console";

const fileObjCreatingNewFile = {id: 0, fileName: '', content: '', parentId: 0}
const fileObj: files = {id: 1, fileName: 'filename01.txt', content: 'hello', parentId: 0}
const folderObj: files = {id: 1, fileName: 'Foldername', content: '', parentId: 0, childNodes:[], isOpened: false}

const onChangeValidator = (fileId: number, fileName: string, inputEl: any): boolean => {
    return true
}

describe('FileItem', () => {

    test('render in default mode as file', () => {
        render(
            <FileItem
                fileObj={fileObj}	
                selected={true}
                focused={true}				
                onFileCreated={()=>{}}
                onChangeValidator={onChangeValidator}
                key={'someFile'}
                level={1}
            />	
        )

        const inputEl = screen.getByRole('textbox')
        const iconEl = screen.getByTestId('icon')
        
        expect(inputEl).toHaveAttribute('readOnly')
        expect(inputEl).toHaveStyle({ userSelect: "none" })
        expect(iconEl).toBeInTheDocument()
        expect(iconEl).toHaveClass('fa-regular fa-file')
    })

    test('render in default mode as folder', () => {
        render(
            <FileItem
                fileObj={folderObj}	
                selected={true}
                focused={true}				
                onFileCreated={()=>{}}
                onChangeValidator={onChangeValidator}
                key={'someFile'}
                level={1}
            />	
        )

        const inputEl = screen.getByRole('textbox')
        const iconEl = screen.getByTestId('icon')
        
        expect(inputEl).toHaveAttribute('readOnly')
        expect(inputEl).toHaveStyle({ userSelect: "none" })
        expect(iconEl).toBeInTheDocument()
        expect(iconEl).toHaveClass('fa-regular fa-folder')
    })    

    test('render in NEW_FILE mode', () => {
        render(
            <FileItem
                fileObj={fileObjCreatingNewFile}	
                selected={false}
                focused={true}		
                mode='NEW_FILE'			
                onFileCreated={()=>{}}
                onChangeValidator={onChangeValidator}
                key={'newFile'}
                level={1}
            />	
        )
        
        const inputEl = screen.getByRole('textbox')
        
        expect(inputEl).not.toHaveAttribute('readOnly')
        expect(inputEl).toHaveStyle({zIndex: "2"})
    })

    test('render in RENAME_FILE mode', () => {
        render(
            <FileItem
                fileObj={fileObj}	
                selected={true}
                focused={true}		
                mode='RENAME_FILE'			
                onFileCreated={()=>{}}
                onChangeValidator={onChangeValidator}
                key={'newFile'}
                level={1}
            />	
        )
        
        const inputEl = screen.getByRole('textbox')
        
        expect(inputEl).not.toHaveAttribute('readOnly')
        expect(inputEl).toHaveStyle({zIndex: "2"})
    })    

})