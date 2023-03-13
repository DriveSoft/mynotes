//export interface files {
export interface IFileTree {
	id: number
	fileName: string
	content: string	
	//parentId: number
	childNodes?: IFileTree[]
}

export interface IFileItem extends IFileTree {
	isOpened?: boolean
	parentId: number
}

export type fileType = 'FILE' | 'FOLDER'

// export interface fileAPI {
// 	id: number
// 	fileName: string
// 	content: string	
// 	parentId: number
// 	type: fileType	
// }

export type typeFile = 'file' | 'folder'