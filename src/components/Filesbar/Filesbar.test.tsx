import { render, screen } from "@testing-library/react"
import user from "@testing-library/user-event"
import Filesbar from "./Filesbar"

const treeData = [
    {
        id: 1,
        fileName: 'File1',
        content: '123',
        parentId: 0        
    },
    {
        id: 2,
        fileName: 'Folder1',
        content: '123',
        parentId: 0,
        childNodes: [
            {
                id: 4,
                fileName: 'File2',
                content: '123',
                parentId: 2,      
            },             
        ],
        isOpened: false       
    },   
    {
        id: 3,
        fileName: 'Folder2',
        content: '123',
        parentId: 0,
        childNodes: [],
        isOpened: true       
    },     
]

export interface files {
	id: number
	fileName: string
	content: string	
	parentId: number
	childNodes?: files[]
	isOpened?: boolean
}

describe('Filebar', () => {
    test('it renders correctly', () => {
        const title = "Dmitriy's notes"

        render(
            <Filesbar
                title={title}
                treeData={treeData}
                selectedFile={1}
            />
        )
        
        const titleEl = screen.getByText(title)
        expect(titleEl).toBeInTheDocument()

        const listItems = screen.queryAllByRole('listitem')
        expect(listItems).toHaveLength(treeData.length)        
    })


    test('it expands folder', async () => {
        const title = "Dmitriy's notes"
        user.setup()
        render(
            <Filesbar
                title={title}
                treeData={treeData}
                selectedFile={1}
            />
        )
        
        const folderItem = screen.getByDisplayValue('Folder1')
        expect(folderItem).toBeInTheDocument()   
        
        await user.click(folderItem)
        const listItems = screen.queryAllByRole('listitem')
        expect(listItems).toHaveLength(treeData.length+1) //in Folder1 we have a file, so it should be +1 file
    })    


    test('it creates a new file', async () => {
        const title = "Dmitriy's notes"
        user.setup()
        render(
            <Filesbar
                title={title}
                treeData={treeData}
                selectedFile={1}
            />
        )
        
        const newFileButton = screen.getByLabelText('Create a new file')
        expect(newFileButton).toBeInTheDocument()           
        await user.click(newFileButton)

        const newInputFile = screen.getByLabelText('Enter a file name')
        expect(newInputFile).toBeInTheDocument() 

        const listItems1 = screen.queryAllByRole('listitem')
        expect(listItems1).toHaveLength(treeData.length+1) //new item for entering name for a new file appers

        await user.click(newInputFile)
        await user.keyboard('NewFile')        
        await user.keyboard('[Enter]')
        const listItems2 = screen.queryAllByRole('listitem')
        expect(listItems2).toHaveLength(treeData.length+1) //new item has been create  
        
        const newFileItem = screen.getByDisplayValue('NewFile')
        expect(newFileItem).toBeInTheDocument() //new item has been create          
    })     


    test('it creates a new folder', async () => {
        const title = "Dmitriy's notes"
        user.setup()
        render(
            <Filesbar
                title={title}
                treeData={treeData}
                selectedFile={1}
            />
        )
        
        const newFolderButton = screen.getByLabelText('Create a new folder')
        expect(newFolderButton).toBeInTheDocument()           
        await user.click(newFolderButton)

        const newInputFile = screen.getByLabelText('Enter a file name')
        expect(newInputFile).toBeInTheDocument() 

        const listItems1 = screen.queryAllByRole('listitem')
        expect(listItems1).toHaveLength(treeData.length+1) //new item for entering name for a new file appers

        await user.click(newInputFile)
        await user.keyboard('NewFolder')        
        await user.keyboard('[Enter]')
        const listItems2 = screen.queryAllByRole('listitem')
        expect(listItems2).toHaveLength(treeData.length+1) //new item has been create  
        
        const newFileItem = screen.getByDisplayValue('NewFolder')
        expect(newFileItem).toBeInTheDocument() //new item has been create          
    }) 


    test('it creates a new file in a not empty subfolder', async () => {
        const title = "Dmitriy's notes"
        user.setup()
        render(
            <Filesbar
                title={title}
                treeData={treeData}
                selectedFile={1}
            />
        )
        

        const folder1Item = screen.getByDisplayValue('Folder1')
        await user.click(folder1Item)

        const newFileButton = screen.getByLabelText('Create a new file')
        expect(newFileButton).toBeInTheDocument()  
        
        await user.click(newFileButton)          
        const newInputFile = screen.getByLabelText('Enter a file name')
        expect(newInputFile).toBeInTheDocument() 

        const listItems1 = screen.queryAllByRole('listitem')
        expect(listItems1).toHaveLength(treeData.length+2) //new item for entering name for a new file appers, also treeData.length don't return number of nested elements

        await user.click(newInputFile)
        await user.keyboard('NewFile')        
        await user.keyboard('[Enter]')
        const listItems2 = screen.queryAllByRole('listitem')
        expect(listItems2).toHaveLength(treeData.length+2) //new item has been create  
        
        const newFileItem = screen.getByDisplayValue('NewFile')
        expect(newFileItem).toBeInTheDocument() //new item has been create          
    })    

    test('it creates a new file in an empty subfolder', async () => {
        const title = "Dmitriy's notes"
        user.setup()
        render(
            <Filesbar
                title={title}
                treeData={treeData}
                selectedFile={1}
            />
        )
        

        const folder1Item = screen.getByDisplayValue('Folder2')
        await user.click(folder1Item)

        const newFileButton = screen.getByLabelText('Create a new file')
        expect(newFileButton).toBeInTheDocument()  
        
        await user.click(newFileButton)          
        const newInputFile = screen.getByLabelText('Enter a file name')
        expect(newInputFile).toBeInTheDocument() 

        const listItems1 = screen.queryAllByRole('listitem')
        expect(listItems1).toHaveLength(treeData.length+1) //new item for entering name for a new file appers

        await user.click(newInputFile)
        await user.keyboard('NewFile')        
        await user.keyboard('[Enter]')
        const listItems2 = screen.queryAllByRole('listitem')
        expect(listItems2).toHaveLength(treeData.length+1) //new item has been create  
        
        const newFileItem = screen.getByDisplayValue('NewFile')
        expect(newFileItem).toBeInTheDocument() //new item has been create          
    })     


    test('it renames a file', async () => {
        const title = "Dmitriy's notes"
        user.setup()                
        render(
            <Filesbar
                title={title}
                treeData={treeData}
                selectedFile={1}
            />            
        )

        const fileEl = screen.getByDisplayValue('File1')
        await user.pointer({target: fileEl, offset: 2, keys: '[MouseRight]'})
        
        const menuEditFileEl = screen.getByText('Edit file')
        expect(menuEditFileEl).toBeInTheDocument()
        
        await user.click(menuEditFileEl)
        await user.click(fileEl)
        await user.keyboard('{Control>}A{/Control}')
        await user.keyboard('{Backspace}')
        await user.keyboard('Renamed file')
        await user.keyboard('[Enter]')
        
        const fileRenamedEl = screen.getByDisplayValue('Renamed file')
        expect(fileRenamedEl).toBeInTheDocument()
    })


    test('it deletes a file', async () => {
        const title = "Dmitriy's notes"
        user.setup()                
        render(
            <Filesbar
                title={title}
                treeData={treeData}
                selectedFile={1}
            />            
        )

        const fileEl = screen.getByDisplayValue('File1')
        await user.pointer({target: fileEl, offset: 2, keys: '[MouseRight]'})
        
        const menuDeleteFileEl = screen.getByText('Delete file')
        expect(menuDeleteFileEl).toBeInTheDocument()

        await user.click(menuDeleteFileEl)
        const buttonDelete = screen.getByRole('button', {  name: /delete/i})
        await user.click(buttonDelete)

        const listItems = screen.queryAllByRole('listitem')
        expect(listItems).toHaveLength(treeData.length-1)
    })

})