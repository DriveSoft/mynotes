
import { render, screen, fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";
import { tabs } from "../types";
import EditorTabs from "./EditorTabs";

const tabsData: tabs[] = [
	{
		id: 1,
		saved: true,
		tabName: "Tab1",
		content: "",
		isLoading: false
	},
	{
		id: 2,
		saved: false,
		tabName: "Tab2",
		content: "",
		isLoading: false
	},
	{
		id: 3,
		saved: true,
		tabName: "Tab3",
		content: "",
		isLoading: false
	},
];

describe("EditorTabs", () => {
	test("should renders correctly", () => {

		render(
            <EditorTabs 
                tabs={tabsData}
                activeFile={2}              
            />
		)

        const tabsEl = screen.getAllByRole('listitem')
	
        expect(tabsEl).toHaveLength(3)	
		expect(tabsEl[1]).toHaveClass('activeTab')
		
		const closeButEl = screen.getAllByTestId('buttonClose')
		expect(closeButEl[1]).toHaveClass('iconCircle')					
	});


	test("should fire event onChangeTab when tab has clicked", async () => {
		user.setup()
		const mockHandlerChangeTab = jest.fn()

		render(
            <EditorTabs 
                tabs={tabsData}
                activeFile={2}  
				onChangeTab={mockHandlerChangeTab}            
            />
		)

		const tabsEl = screen.getAllByRole('listitem')
		await user.click(tabsEl[0])
		expect(mockHandlerChangeTab).toHaveBeenCalledTimes(1)

		const eventObject = mockHandlerChangeTab.mock.calls[0][0]
		expect(eventObject).toStrictEqual({ id: 1, saved: true, tabName: 'Tab1', content: '' })
	});


	test("should fire events", async () => {
		user.setup()
		const mockHandlerCloseTab = jest.fn()

		render(
            <EditorTabs 
                tabs={tabsData}
                activeFile={1}  
				onCloseTab={mockHandlerCloseTab}            
            />
		)

		const closeButEl = screen.getAllByTestId('buttonClose')
		await user.click(closeButEl[0])
		expect(mockHandlerCloseTab).toHaveBeenCalledTimes(1)

		const eventObject = mockHandlerCloseTab.mock.calls[0][0]
		expect(eventObject).toStrictEqual({ id: 1, saved: true, tabName: 'Tab1', content: '' })
	});	


	test('should drag and drop', () => {
		user.setup()
		const mockHandlerDropFinished = jest.fn()

		render(
            <EditorTabs 
                tabs={tabsData}
                activeFile={1}  
				onDropFinished={mockHandlerDropFinished}            
            />
		)		

		const tabsEl = screen.getAllByRole('listitem')

		fireEvent.dragStart(tabsEl[0]);
		fireEvent.dragEnter(tabsEl[1]);
		fireEvent.dragOver(tabsEl[1]);
		fireEvent.drop(tabsEl[1]);
		fireEvent.dragEnd(tabsEl[1]);
	
		expect(mockHandlerDropFinished).toHaveBeenCalledTimes(1);
		expect(mockHandlerDropFinished).toHaveBeenCalledWith([tabsData[1], tabsData[0], tabsData[2]]);

	})	
});
