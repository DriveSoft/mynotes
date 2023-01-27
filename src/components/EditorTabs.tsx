import React from "react";

function EditorTabs() {
	return (
		<div className="editorTabs">
			<div className="tab activeTab">
				<i className="tabIcon fa-regular fa-file-lines"></i>
				<p className="tabFilename">indfgddex.html</p>
				<p className="tabCloseButton">⨉</p>
			</div>

			<div className="tab">
				<i className="tabIcon fa-regular fa-file-lines"></i>
				<p className="tabFilename">style.css</p>
				<p className="tabCloseButton">⨉</p>
			</div>

			<div className="tab">
				<i className="tabIcon fa-regular fa-file-lines"></i>
				<p className="tabFilename">index.html</p>
				<p className="tabCloseButton">⨉</p>
			</div>
		</div>
	);
}

export default EditorTabs;
