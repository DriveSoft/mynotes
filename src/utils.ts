import { IFileAPI } from "./types"
import { IFileTree } from "./components/Filesbar/types"

export const URL_API = 'https://retoolapi.dev/41py8X/data'

const fetchOptions = {
    mode: 'cors' as RequestMode, // no-cors, *cors, same-origin
    cache: 'no-cache' as RequestCache, // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin' as RequestCredentials, // include, *same-origin, omit
    headers: {'Content-Type': 'application/json'},
    redirect: 'follow' as RequestRedirect, // manual, *follow, error
    referrerPolicy: 'no-referrer' as ReferrerPolicy, // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url  
}

export const sortFiles = (files: IFileTree[]) => {
    const copyArr = [...files]
    return copyArr.sort((a, b) => a.fileName > b.fileName ? 1 : -1)
}

export async function createFilenameAPI(file: IFileAPI): Promise<number>{
    const fileObjApi = {...file}
    //@ts-ignore We have to remove id from obj to get new id by server
    delete fileObjApi.id;

    const response = await fetch(`${URL_API}`, {...fetchOptions, method: 'POST', body: JSON.stringify(fileObjApi)})          
    if(!response.ok) throw new Error(response.status.toString()) 

    const data = await response.json()    
    const result = parseInt(data.id)
              
    if(isNaN(result)) throw new Error('Wrong id for a new record')
    return result
}

export async function updateFilenameAPI(file: IFileAPI): Promise<any>{

    // const fileObjApi: fileAPI = {
    //     id: file.id,
    //     fileName: file.fileName,
    //     content: file.content,
    //     parentId: file.parentId,
    //     type: file?.childNodes ? 'FOLDER' : 'FILE'
    // };

    const response = await fetch(`${URL_API}/${file.id}`, {...fetchOptions, method: 'PUT', body: JSON.stringify(file)})

    if(!response.ok) throw new Error(response.status.toString())

    const data = await response.json()
    if(data?.fileName !== file.fileName) throw new Error('Something wrong with renaming of the file')
    return
}

export async function deleteFilenameAPI(id: number){
    const response = await fetch(`${URL_API}/${id}`, {...fetchOptions, method: 'DELETE'})
    if(!response.ok) throw new Error(response.status.toString())
}

export function getFileById(fileList: IFileTree[], id: number): IFileTree | undefined {
    let result: IFileTree | undefined = undefined

    const findObj = (fileList: IFileTree[]) => {
        let res = fileList.find(file => {
            if(file?.childNodes?.length && file.childNodes.length > 0) findObj(file.childNodes)
            return file.id === id
        })

        if (res) result = res
        return result
    }

    return findObj(fileList);
}

export function changeContentAndUpdateFileList(fileList: IFileTree[], idFile: number, content: string): IFileTree[] | undefined {

    const mapItems = (files: IFileTree[]): IFileTree[] => {
        return files.map((file: IFileTree) => {
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

export async function saveFileContentToApiAndGetUpdatedState(fileList: IFileTree[], idFile: number, content: string) {    
    const fileObj = getFileById(fileList, idFile);
    if(!fileObj) return undefined
    fileObj.content = content
		
    const fileObjApi: IFileAPI = {
        id: fileObj.id,
        fileName: fileObj.fileName,
        content: fileObj.content,
        //parentId: fileObj.parentId,
        parentId: getParentId(fileList, fileObj.id),
        type: fileObj?.childNodes ? 'FOLDER' : 'FILE'
    }

    await updateFilenameAPI(fileObjApi)              
    return changeContentAndUpdateFileList(fileList, idFile, content) 
}

function getParentId(dataTree: IFileTree[], fileId: number, parentId: number = 0): number {
    let result = -1

    dataTree.every(item => {        
        if(item.id === fileId) {
            result = parentId 
            return false
        } else {
            if(item?.childNodes) {
                result = getParentId(item?.childNodes, fileId, item.id)
                return result === -1
            }
            return true
        }
    })  
    
    return result
}