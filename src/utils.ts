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

export async function createFilenameAPI(file: files): Promise<number | undefined>{

    const fileObjApi: fileAPI = {        
        id: 0,
        fileName: file.fileName,
        content: file.content,
        parentId: file.parentId,
        type: file?.childNodes ? 'FOLDER' : 'FILE'
    };
    //@ts-ignore We have to remove id from obj to get new id by server
    delete fileObjApi.id;

    console.log(fileObjApi)
    const response = await fetch(`${URL_API}`, {...fetchOptions, method: 'POST', body: JSON.stringify(fileObjApi)})
    
    const data = await response.json()    
    if(!response.ok) throw new Error(response.status.toString())
    //return data?.fileName === fileObjApi.fileName
    
    const result = parseInt(data.id)
    if(result === undefined) return undefined
    return result
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

// export function getUpdatedFileList(fileList: files[], objFile: files): files[] | undefined {
//     //const files = [...fileList]
//     const files = structuredClone(fileList);
//     let result: files | undefined = undefined

//     const findObj = (files: files[]) => {
//         let res = files.find(file => {
//             if(file?.childNodes?.length && file.childNodes.length > 0) findObj(file.childNodes)
//             return file.id === objFile.id
//         })

//         if (res) result = res
//         return result
//     }

//     let obj = findObj(files)
//     if (obj) {
//         obj = objFile
//         return files
//     }

//     return undefined
// }

export function changeContentAndUpdateFileList(fileList: files[], idFile: number, content: string): files[] | undefined {

    const mapItems = (files: files[]): files[] => {
        return files.map((file: files) => {
            if (file?.childNodes && file.childNodes.length > 0) {
                return {...file, childNodes: mapItems(file.childNodes)}
            } else {
                if(file.id === idFile) {
                    return {...file, content: content}
                }
                return file
            }
        })
    }

    return mapItems(fileList)
}

export function changeFilenameAndUpdateFileList(fileList: files[], idFile: number, newFilename: string): files[] | undefined {

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

export function createFileAndUpdateFileList(fileList: files[], newIdFile: number, idParentFile: number, fileName: string): files[] | undefined {
    
    const mapItems = (files: files[]): files[] => {
        return files.map((file: files) => {
            if (file?.childNodes && file.childNodes.length > 0) {
                if(file.id == idParentFile) file.childNodes.push({id: newIdFile, parentId: idParentFile, fileName: fileName, content: ''})
                return {...file, childNodes: mapItems(file.childNodes)}
            } else {
                return file
            }
        })
    }

    const result = mapItems(fileList)
    
    if(idParentFile === 0) {  // new file in root      
        result.push({id: newIdFile, parentId: 0, fileName: fileName, content: ''})
    }

    return result
}





// export async function saveFileContentToApiAndGetUpdatedState(fileList: files[], idFile: number, content: string) {
//     // const fileObj = getFileById(fileList, idFile);
//     // if(!fileObj) return undefined
//     // fileObj.content = content
 			
//     // if (await updateFilenameAPI(fileObj)) {
//     //     return getUpdatedFileList(fileList, fileObj)            
//     // }

//     // return undefined 

//     const fileObj = getFileById(fileList, idFile);
//     if(!fileObj) return undefined
//     fileObj.content = content
 			
//     if (await updateFilenameAPI(fileObj)) {
//         return changeContentAndUpdateFileList(fileList, idFile, content)           
//     }

//     return undefined     
// };

export async function saveFileContentToApiAndGetUpdatedState(fileList: files[], idFile: number, content: string) {

    const fileObj = getFileById(fileList, idFile);
    if(!fileObj) return undefined
    fileObj.content = content
 			
    if (await updateFilenameAPI(fileObj)) {
        return changeContentAndUpdateFileList(fileList, idFile, content)           
    }

    return undefined     
};

export async function renameFilenameToApiAndGetUpdatedState(fileList: files[], idFile: number, newFilename: string) {
    const fileObj = getFileById(fileList, idFile);
    if(!fileObj) return undefined
    fileObj.fileName = newFilename
 			
    if (await updateFilenameAPI(fileObj)) {
        //return getUpdatedFileList(fileList, fileObj)     
        return changeFilenameAndUpdateFileList(fileList, idFile, newFilename)       
    }

    return undefined 
};