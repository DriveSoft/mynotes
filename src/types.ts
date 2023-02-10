import { StrictMode } from "react";

//https://www.youtube.com/watch?v=jjMbPt_H3RQ
export const BUTTONS_ID = {
	FILES: 'files',
	SEARCH: 'search',
	PROFILE: 'profile',
	NONE: 'none'
}
export type ButtonId = keyof typeof BUTTONS_ID;


export interface sidebarButton {
	id: ButtonId;
	icon: string;
}

export interface files {
	id: string;	
	fileName: string;
	content: string;	
}

export interface tabs {
	id: string;
	saved: boolean;
}