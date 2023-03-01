import { files, typeFile } from "./types"

export function createFileAndUpdateFileList(fileList: files[], newIdFile: number, idParentFile: number, fileName: string, typeFile: typeFile): files[] {
    let objNewFile: files = {id: newIdFile, parentId: idParentFile, fileName: fileName, content: ''}                    
    if(typeFile === 'folder') objNewFile = {...objNewFile, childNodes: [], isOpened: false}    

    const mapItems = (files: files[]): files[] => {
        return files.map((file: files) => {
            if (file?.childNodes) {
                if(file.id == idParentFile) {
                    file.childNodes.push(objNewFile)
                }
                return {...file, childNodes: mapItems(file.childNodes)}
            } else {
                return file
            }
        })
    }

    const result = mapItems(fileList)
    
    if(idParentFile === 0) {  // new file in root              
        result.push(objNewFile)
    }

    return result
}

export function changeFilenameAndUpdateFileList(fileList: files[], idFile: number, newFilename: string): files[] {

    const mapItems = (files: files[]): files[] => {
        return files.map((file: files) => {
            if (file?.childNodes && file.childNodes.length > 0) {
                return {...file, childNodes: mapItems(file.childNodes)}
            } else {
                if(file.id === idFile) {
                    return {...file, fileName: newFilename}
                }
                return file
            }
        })
    }

    return mapItems(fileList)
}

export function deleteFileAndUpdateFileList(fileList: files[], idFile: number): files[] {
    const mapItems = (files: files[]): files[] => {
        return files.filter((file: files) => {            
            if (file?.childNodes && file.childNodes.length > 0) file.childNodes = mapItems(file.childNodes)                                       
            return file.id !== idFile
        })
    }

    return mapItems(fileList)
}

export function changeIsOpenedAndUpdateFileList(fileList: files[], idFile: number): files[] {

    const mapItems = (files: files[]): files[] => {
        return files.map((file: files) => {
            if (file?.childNodes) {
                if(file.id === idFile) {
                    return {...file, childNodes: mapItems(file.childNodes), isOpened: !file.isOpened}
                }
                return {...file, childNodes: mapItems(file.childNodes)}
            } else {
                return file
            }
        })
    }

    return mapItems(fileList)
}

export function getFileById(fileList: files[], id: number): files | undefined {
    let result: files | undefined = undefined

    const findObj = (fileList: files[]) => {
        let res = fileList.find(file => {
            if(file?.childNodes?.length && file.childNodes.length > 0) findObj(file.childNodes)
            return file.id === id
        })

        if (res) result = res
        return result
    }

    return findObj(fileList);
}

export function getNewId(fileList: files[]): number {
    let result = 0

    const findMaxId = (fileList: files[]) => {
        fileList.forEach(file => {
            if(file?.childNodes?.length && file.childNodes.length > 0) findMaxId(file.childNodes)
            if(file.id > result) result = file.id
        })
    }

    findMaxId(fileList);
    return result+1
}