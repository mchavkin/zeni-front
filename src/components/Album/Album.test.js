import React from 'react'
import {render, cleanup} from '@testing-library/react'
import Album from "./Album"
import '@testing-library/jest-dom/extend-expect'

const testPhotos = [
    {
        id: 1,
        url: 'test.url',
        title: 'test'
    },
    {
        id: 2,
        url: 'test.url',
        title: 'test'
    },
    {
        id: 3,
        url: 'test.url',
        title: 'test'
    },
]

afterEach(cleanup)

it("should have 3 photos with descriptions", () => {
    const {queryAllByTestId} = render(<Album photos={testPhotos}/>)
    expect(queryAllByTestId("photo-with-description").length).toBe(testPhotos.length)
})
