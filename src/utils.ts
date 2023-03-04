import { fileAPI, files, typeFile } from "./types"

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

export async function createFilenameAPI(file: files): Promise<number>{
    const fileObjApi: fileAPI = {        
        id: 0,
        fileName: file.fileName,
        content: file.content,
        parentId: file.parentId,
        type: file?.childNodes ? 'FOLDER' : 'FILE'
    };
    //@ts-ignore We have to remove id from obj to get new id by server
    delete fileObjApi.id;

    const response = await fetch(`${URL_API}`, {...fetchOptions, method: 'POST', body: JSON.stringify(fileObjApi)})    
    if(!response.ok) throw new Error(response.status.toString()) 

    const data = await response.json()    
    const result = parseInt(data.id)
              
    if(isNaN(result)) throw new Error('Wrong id for a new record')
    return result
}

export async function updateFilenameAPI(file: files): Promise<any>{

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
    if(data?.fileName !== file.fileName) throw new Error('Something wrong with renaming of the file')
    return
}

export async function deleteFilenameAPI(id: number){
    const response = await fetch(`${URL_API}/${id}`, {...fetchOptions, method: 'DELETE'})
    if(!response.ok) throw new Error(response.status.toString())
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

export async function saveFileContentToApiAndGetUpdatedState(fileList: files[], idFile: number, content: string) {    
    const fileObj = getFileById(fileList, idFile);
    if(!fileObj) return undefined
    fileObj.content = content
		
    await updateFilenameAPI(fileObj)              
    return changeContentAndUpdateFileList(fileList, idFile, content) 
}