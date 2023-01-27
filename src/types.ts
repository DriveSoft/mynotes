//https://www.youtube.com/watch?v=jjMbPt_H3RQ
export const BUTTONS_ID = {
	FILES: 'files',
	SEARCH: 'search',
	USER: 'user'
}
export type ButtonId = keyof typeof BUTTONS_ID;


export interface sidebarButton {
	id: ButtonId;
	icon: string;
}