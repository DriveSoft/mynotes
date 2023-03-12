export interface files {
	id: number
	fileName: string
	content: string	
	parentId: number
	childNodes?: files[]
	//isOpened?: boolean
}

export type fileType = 'FILE' | 'FOLDER'

export interface fileAPI {
	id: number
	fileName: string
	content: string	
	parentId: number
	type: fileType	
}

export type typeFile = 'file' | 'folder'