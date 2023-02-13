import { files } from "./types"

//export const URL_API = 'https://retoolapi.dev/ttTL6H/data'
export const URL_API = 'https://retoolapi.dev/41py8X/data'

export const sortFiles = (files: files[]) => {
    console.log('sortFiles')
    const copyArr = [...files]
    return copyArr.sort((a, b) => a.fileName > b.fileName ? 1 : -1)
}

export async function createFilenameAPI(id: number, newFilename: string, parentId: number){
    const response = await fetch(`${URL_API}`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({id: id, fileName: newFilename, content: '', parentId: 0}) // body data type must match "Content-Type" header
    })

    if(!response.ok) throw new Error(response.status.toString())

    const data = await response.json()    
    return data?.fileName === newFilename
}

export async function updateFilenameAPI(id: number, fileName: string, content: string, parentId: number){
    const response = await fetch(`${URL_API}/${id}`, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({fileName: fileName, content: content, parentId: 0}) // body data type must match "Content-Type" header
    })

    console.log(content)

    if(!response.ok) throw new Error(response.status.toString())

    const data = await response.json()
    return data?.fileName === fileName
}

export async function deleteFilenameAPI(id: number){
    const response = await fetch(`${URL_API}/${id}`, {
        method: 'DELETE', 
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url			
    })

    if(!response.ok) throw new Error(response.status.toString())
    return response.ok
}