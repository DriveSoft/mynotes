import { files } from "./types"

export const sortFiles = (files: files[]) => {
    const copyArr = [...files]
    return copyArr.sort((a, b) => a.fileName > b.fileName ? 1 : -1)
}

export const URL_API = 'https://retoolapi.dev/ttTL6H/data'