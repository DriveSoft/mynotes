
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { tabs } from "../types";
import EditorTabs from "./EditorTabs";

const tabsData: tabs[] = [
	{
		id: 1,
		saved: true,
		tabName: "Tab1",
		content: "",
	},
	{
		id: 2,
		saved: false,
		tabName: "Tab2",
		content: "",
	},
	{
		id: 3,
		saved: true,
		tabName: "Tab3",
		content: "",
	},
];

describe("EditorTabs", () => {
	test("should renders correctly", () => {

		const saveFileContent = async (
			idFile: number,
			context: string
		): Promise<any> => {
			return;
		};

		// render(
		// 	<EditorTabs
		// 		tabs={dataTabs}
		// 		setTabs={setDataTabs}
		// 		activeFile={activeFile}
		// 		setActiveFile={setActiveFile}
		// 		saveFileContent={saveFileContent}
		// 	/>
		// );

        const tabsEl = screen.getAllByRole('listitem')
        expect(tabsEl).toHaveLength(3)


	});
});
