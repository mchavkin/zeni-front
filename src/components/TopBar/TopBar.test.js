import React from 'react'
import {cleanup, render} from '@testing-library/react'
import TopBar from "./TopBar";
import '@testing-library/jest-dom/extend-expect'

afterEach(cleanup)

it("should display number of total and recent photos", () => {
    const {getByTestId, rerender} = render(<TopBar totalPhotos={100} recentPhotos={5}/>)
    expect(getByTestId("totalPhotos")).toHaveTextContent("100")
    expect(getByTestId("updatedPhotos")).toHaveTextContent("5")
})