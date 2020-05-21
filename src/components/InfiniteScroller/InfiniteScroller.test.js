import React from 'react';
import {cleanup, render} from '@testing-library/react'
import InfiniteScroller from "./InfiniteScroller";


afterAll(cleanup)

it("should instantiate IntersectionObserver and connect observation to scrolling element", () => {
    const callback = jest.fn()
    const props = {
        fetchEntries: callback,
        maxEntries: 100,
        currentEntries: 10
    }
    const observe = jest.fn()


    window.IntersectionObserver = jest.fn(function (cb) {
        this.observe = observe
    })
    const {getByTestId} = render(<InfiniteScroller {...props}/>)
    expect(window.IntersectionObserver.mock.calls.length).toBe(1)
    expect(observe).toBeCalledWith(getByTestId("scroller"))

    const observerCallback = window.IntersectionObserver.mock.calls[0][0]
    observerCallback([{isIntersecting: true}])

    expect(callback).toBeCalled()


})