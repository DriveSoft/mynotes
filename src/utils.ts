import { files } from "./types"

// export const sortFiles = (files: files) => {
//     const sortedAr = Object.keys(files).sort((a, b) => files[a] > files[b] ? 1 : -1)		
//     const objFiles: files = {}
//     sortedAr.forEach(item => objFiles[item] = files[item] )
//     return objFiles
// }

export const sortFiles = (files: files[]) => {
    const copyArr = [...files]
    return copyArr.sort((a, b) => a.fileName > b.fileName ? 1 : -1)
}