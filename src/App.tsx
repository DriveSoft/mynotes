import React, { useState, useEffect } from "react";
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
// const defaultFiles: files = {
// 	"idsfdf": "index.html",
// 	"idrtrth": "style.css",
// 	"iddffhd": "logo.svg"
// }

function App() {
	const [activeSidebarButton, setActiveSidebarButton] = useState<ButtonId>("FILES");

	const [fileList, setFileList] = useState(files);
	const [activeFile, setActiveFile] = useState<string | undefined>(files[0]);
	const [tabs, setTabs] = useState([files[0]]);

	useEffect(() => {
		if (!activeFile) return
		if (!tabs.includes(activeFile)) {
			setTabs([...tabs, activeFile]);
		}
	}, [activeFile])


	return (
		<div className="wrapper">
			<Sidebar
				sidebarButtons={sidebarButtons}
				activeButton={activeSidebarButton}
				setActiveSidebarButton={setActiveSidebarButton}
			/>
			<Filesbar
				title="Dmitriy's notes"
				fileList={fileList}
				setFileList={setFileList}
				activeFile={activeFile}
				setActiveFile={setActiveFile}
			/>

			<div className="editorWrapper">
				<EditorTabs
					files={files}
					activeFile={activeFile}
					setActiveFile={setActiveFile}
					tabs={tabs}
					setTabs={setTabs}
				/>
				<TextEditor tabs={tabs} activeFile={activeFile} />
			</div>
		</div>
	);
}

export default App;
