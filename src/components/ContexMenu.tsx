import React, { useEffect } from "react";
import "./ContexMenu.css";

interface ContexMenuProps {
	showMenu: { show: boolean; x: number; y: number; fileId: string };
	onClickItem: (fileId: string, itemId: string) => void;
	setShowMenu: any;
}

const ContexMenu = ({
	showMenu,
	onClickItem,
	setShowMenu,
}: ContexMenuProps) => {
	const menuData = [
		{
			id: "NEW_FILE",
			title: "New file",
			fileReq: false,
		},
		{
			id: "EDIT_FILE",
			title: "Edit file",
			fileReq: true,
		},
		{
			id: "DELETE_FILE",
			title: "Delete file",
			fileReq: true,
		},
	];

	useEffect(() => {
		const handleClick = () =>
			setShowMenu((prev: any) => ({ ...prev, show: false }));
		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, []);

	return (
		<div
			className="containerMenu"
			style={{ left: showMenu.x, top: showMenu.y }}
		>            
			<ul>
				{menuData.map((item) => (
					<li
						key={item.id}
                        style={{cursor: item.fileReq && showMenu.fileId === '' ? "default" : "pointer", color: item.fileReq && showMenu.fileId === '' ? "gray" : "white"  }}
						onClick={() => !(item.fileReq && showMenu.fileId === '') && onClickItem(showMenu.fileId, item.id)}
					>
						{item.title}                        
					</li>
				))}
			</ul>
		</div>
	);
};

export default ContexMenu;
