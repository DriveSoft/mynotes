import { fileType } from "./components/Filesbar/types"

//https://www.youtube.com/watch?v=jjMbPt_H3RQ
export const BUTTONS_ID = {
	FILES: 'files',
	SEARCH: 'search',
	PROFILE: 'profile',
	NONE: 'none'
}
export type ButtonId = keyof typeof BUTTONS_ID;


export interface sidebarButton {
	id: ButtonId
	icon: string
}

// export interface files {
// 	id: number
// 	fileName: string
// 	content: string	
// 	//parentId: number
// 	childNodes?: files[]
// }

//export type fileType = 'FILE' | 'FOLDER'

export interface IFileAPI {
	id: number
	fileName: string
	content: string	
	parentId: number
	type: fileType	
}

export interface tabs {
	id: number
	saved: boolean
	tabName: string
	content: string | undefined
	isLoading: boolean
}

export type typeFile = 'file' | 'folder'