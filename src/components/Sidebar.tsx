import React from "react"
import "./Sidebar.css"
import { ButtonId, sidebarButton } from "../types";

const sidebarButtons: sidebarButton[] = [
	{
		id: "FILES",
		icon: "fa-regular fa-file",
	},
	{
		id: "SEARCH",
		icon: "fa-solid fa-magnifying-glass",
	},
	{
		id: "PROFILE",
		icon: "fa-regular fa-user",
	},
];

interface SidebarProps {
	activeButton: ButtonId;
	setActiveSidebarButton: (value: ButtonId) => void;
}

function Sidebar({
	activeButton,
	setActiveSidebarButton,
}: SidebarProps) {
	
	const onButtonClick = (id: ButtonId) => {
		if (activeButton === id) { 
			setActiveSidebarButton('NONE');
		} else {
			setActiveSidebarButton(id);	
		}
	};

	return (
		<div className="sidebar">
			{sidebarButtons.map((item) => (
				<button
					onClick={() => onButtonClick(item.id)}
					className={
						activeButton === item.id ? "activeSidebarButton" : ""
					}
					key={item.id}
				>
					<i className={item.icon}></i>
				</button>
			))}
		</div>
	);
}

export default Sidebar;
