import React from "react";
import { ButtonId, sidebarButton } from "../types";

interface SidebarProps {
	sidebarButtons: sidebarButton[];
	activeButton: ButtonId;
	setActiveSidebarButton: (value: ButtonId) => void;
}

function Sidebar({
	sidebarButtons,
	activeButton,
	setActiveSidebarButton,
}: SidebarProps) {
	const onButtonClick = (id: ButtonId) => {
		setActiveSidebarButton(id);
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
