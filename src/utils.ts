import { fileAPI, files } from "./types"

export const URL_API = 'https://retoolapi.dev/41py8X/data'

const fetchOptions = {
    mode: 'cors' as RequestMode, // no-cors, *cors, same-origin
    cache: 'no-cache' as RequestCache, // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin' as RequestCredentials, // include, *same-origin, omit
    headers: {'Content-Type': 'application/json'},
    redirect: 'follow' as RequestRedirect, // manual, *follow, error
    referrerPolicy: 'no-referrer' as ReferrerPolicy, // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url  
}

export const sortFiles = (files: files[]) => {
    const copyArr = [...files]
    return copyArr.sort((a, b) => a.fileName > b.fileName ? 1 : -1)
}

export async function createFilenameAPI(file: files){

    const fileObjApi: fileAPI = {
        id: file.id,
        fileName: file.fileName,
        content: file.content,
        parentId: file.parentId,
        type: file?.childNodes ? 'FOLDER' : 'FILE'
    };

    const response = await fetch(`${URL_API}`, {...fetchOptions, method: 'POST', body: JSON.stringify(fileObjApi)})
    
    const data = await response.json()    
    if(!response.ok) throw new Error(response.status.toString())
    return data?.fileName === fileObjApi.fileName
}

export async function updateFilenameAPI(file: files){

    const fileObjApi: fileAPI = {
        id: file.id,
        fileName: file.fileName,
        content: file.content,
        parentId: file.parentId,
        type: file?.childNodes ? 'FOLDER' : 'FILE'
    };

    const response = await fetch(`${URL_API}/${file.id}`, {...fetchOptions, method: 'PUT', body: JSON.stringify(fileObjApi)})

    if(!response.ok) throw new Error(response.status.toString())

    const data = await response.json()
    return data?.fileName === file.fileName
}

export async function deleteFilenameAPI(id: number){
    const response = await fetch(`${URL_API}/${id}`, {...fetchOptions, method: 'DELETE'})
    if(!response.ok) throw new Error(response.status.toString())
    return response.ok
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

export function getUpdatedFileList(fileList: files[], objFile: files): files[] | undefined {
    //const files = [...fileList]
    const files = structuredClone(fileList);
    let result: files | undefined = undefined

    const findObj = (files: files[]) => {
        let res = files.find(file => {
            if(file?.childNodes?.length && file.childNodes.length > 0) findObj(file.childNodes)
            return file.id === objFile.id
        })

        if (res) result = res
        return result
    }

    let obj = findObj(files)
    if (obj) {
        obj = objFile
        return files
    }

    return undefined
}


export async function saveFileContentToApiAndGetUpdatedState(fileList: files[], idFile: number, content: string) {
    const fileObj = getFileById(fileList, idFile);
    if(!fileObj) return undefined
    fileObj.content = content
 			
    if (await updateFilenameAPI(fileObj)) {
        return getUpdatedFileList(fileList, fileObj)            
    }

    return undefined 
};

export async function renameFilenameToApiAndGetUpdatedState(fileList: files[], idFile: number, newFilename: string) {
    const fileObj = getFileById(fileList, idFile);
    if(!fileObj) return undefined
    fileObj.fileName = newFilename
 			
    if (await updateFilenameAPI(fileObj)) {
        return getUpdatedFileList(fileList, fileObj)            
    }

    return undefined 
};