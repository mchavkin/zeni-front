import React from 'react';
import {render, cleanup} from '@testing-library/react'
import BottomBar from "./BottomBar"
import '@testing-library/jest-dom/extend-expect'
import {act} from "react-dom/test-utils"

afterAll(cleanup)

it("should setup stopwatch to 0; in 3 sec update to 3 and reset on reset props change", () => {
    jest.useFakeTimers()
    const {getByTestId, rerender} = render(<BottomBar reset={Date.now()}/>)

    const stopwatch = getByTestId("stopwatch")
    expect(stopwatch).toHaveTextContent("0 s ago")

    act(() => jest.advanceTimersByTime(3000))
    expect(stopwatch).not.toHaveTextContent("0 s ago")
    expect(stopwatch).toHaveTextContent("3 s ago")

    act(() => {
        rerender(<BottomBar reset={Date.now()}/>)
    })
    expect(stopwatch).toHaveTextContent("0 s ago")

})