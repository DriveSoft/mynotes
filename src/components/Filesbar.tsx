import React, {useState} from "react";

interface FilesbarProps {
	title?: string;
	files: string[];
	activeFile?: string;
	setActiveFile: (value: string) => void;
}

function Filesbar({ title, files, activeFile, setActiveFile }: FilesbarProps) {
	const [focused, setFocused] = useState(false)


	return (
		<div className="filesbar" tabIndex={0} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
			<p>EXPLORER</p>
			<div className="files">
				{title && <p>{title}</p>}
				<ul>
					{files.map((item: string) => (
						<li 
							className={activeFile === item && focused ? "selectedFocusedFile " : "" + activeFile === item ? "selectedFile" : ""}
							onClick={()=>setActiveFile(item)}
							key={item}
						>
							<i className="fa-regular fa-file-lines"></i>
							{item}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default Filesbar;
