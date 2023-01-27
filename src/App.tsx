import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Filesbar from "./components/Filesbar";
import EditorTabs from "./components/EditorTabs";
import TextEditor from "./components/TextEditor";
import { ButtonId, sidebarButton } from "./types";

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
		id: "USER",
		icon: "fa-regular fa-user",
	},
];

const files = ["index.html", "style.css", "logo.svg"];

function App() {
	const [activeSidebarButton, setActiveSidebarButton] = useState<ButtonId>("FILES");

	const [activeFile, setActiveFile] = useState("index.html");

	return (
		<div className="wrapper">
			<Sidebar
				sidebarButtons={sidebarButtons}
				activeButton={activeSidebarButton}
				setActiveSidebarButton={setActiveSidebarButton}
			/>
			<Filesbar 
				title="Dmitriy's notes" 
				files={files} 
				activeFile={activeFile}
				setActiveFile={setActiveFile}
			/>

			<div className="editorWrapper">
				<EditorTabs />
				<TextEditor />
			</div>
		</div>
	);
}

export default App;
