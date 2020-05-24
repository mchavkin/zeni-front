import React from 'react'
import {cleanup, fireEvent, render} from '@testing-library/react'
import Zinfinite from "./Zinfinite"
import BottomBar from "./components/BottomBar/BottomBar"
import axiosMock from 'axios'
import Album from "./components/Album/Album"
import {wait} from "@testing-library/dom"

jest.mock("./components/BottomBar/BottomBar", () => {
    return jest.fn().mockImplementation(() => {
        return <div>BottomBar</div>
    })
})

jest.mock("./components/Album/Album", () => {
    return jest.fn().mockImplementation(() => {
        return <div>Album</div>
    })
})

jest.mock("./components/InfiniteScroller/InfiniteScroller", () => {
    return jest.fn().mockImplementation(({fetchEntries}) => {
        return <div onClick={fetchEntries}>InfiniteScroller</div>
    })
})


jest.mock('axios')
beforeEach(jest.clearAllMocks)
afterEach(cleanup)

describe("test container and logics", () => {

    window.EventSource = jest.fn(function () {
        window.addEventListener('message', (event) => this.onmessage(event))
    })

    const dataGenerator = mockDataGeneratorMaker()


    it("renders components with initial props and updates them on SSE", () => {
        const {getByTestId} = render(<Zinfinite/>)
        const totalPhotos = getByTestId('totalPhotos')
        const updatedPhotos = getByTestId('updatedPhotos')

        //test initial props
        expect(totalPhotos).toHaveTextContent('0')
        expect(updatedPhotos).toHaveTextContent('0')

        let data = dataGenerator(3)

        fireEvent(window, new MessageEvent('message', {data: JSON.stringify(data)}))
        //test updated props
        expect(totalPhotos).toHaveTextContent('3')
        expect(updatedPhotos).toHaveTextContent('3')
        expect(Album.mock.calls.slice(-1)[0][0]).toEqual({photos: data.photo})

        let newPhotos = dataGenerator(2).photo

        data.photo.push(...newPhotos)

        let lastUpdate = BottomBar.mock.calls.slice(-1)[0][0]
        fireEvent(window, new MessageEvent('message', {data: JSON.stringify(data)}))
        //test partially updated props
        expect(totalPhotos).toHaveTextContent('5')
        expect(updatedPhotos).toHaveTextContent('2')

        //test that new photos were added before the old ones
        expect(Album.mock.calls.slice(-1)[0][0].photos.slice(0, newPhotos.length)).toEqual(newPhotos)

        //test counter reset on photo update
        expect(BottomBar.mock.calls.slice(-1)[0][0]).not.toEqual(lastUpdate)

        lastUpdate = BottomBar.mock.calls.slice(-1)[0][0]
        fireEvent(window, new MessageEvent('message', {data: JSON.stringify(data)}))
        //test counter reset ignore when photos not updated
        expect(BottomBar.mock.calls.slice(-1)[0][0]).toEqual(lastUpdate)
    })

    it("renders components with initial props and updates them on axios calls", async () => {
        const {getByText, getByTestId} = render(<Zinfinite/>)
        const scroller = getByText('InfiniteScroller')
        const totalPhotos = getByTestId('totalPhotos')

        let data
        axiosMock.get
            .mockImplementationOnce(() => {
                data = dataGenerator(7)
                return Promise.resolve({data: data})
            })
            .mockImplementationOnce(() => {
                data = {photo: data.photo.slice(-2).concat(dataGenerator(3).photo)}
                return Promise.resolve({data: data})
            })
            .mockImplementationOnce(() =>
                Promise.resolve({data: data})
            )
            .mockImplementation(() => {
                data = dataGenerator(5)
                return Promise.resolve({data: data})
            })

        //test initial props
        expect(totalPhotos).toHaveTextContent('0')


        //Test next page fetch
        fireEvent.click(scroller)
        await wait(() => expect(totalPhotos).toHaveTextContent('7'))
        expect(Album.mock.calls.slice(-1)[0][0]).toEqual({photos: data.photo})
        expect(axiosMock.get).toHaveBeenCalledTimes(1)

        //Test next page fetch with some photos repeating
        fireEvent.click(scroller)
        await wait(() => expect(totalPhotos).toHaveTextContent('10'))
        expect(Album.mock.calls.slice(-1)[0][0].photos.slice(-3)).toEqual(data.photo.slice(-3))
        expect(axiosMock.get).toHaveBeenCalledTimes(2)

        // Test next page fetch with all photos repeating (should fetch 2 times)
        fireEvent.click(scroller)
        await wait(() => expect(totalPhotos).toHaveTextContent('15'))
        expect(Album.mock.calls.slice(-1)[0][0].photos.slice(-5)).toEqual(data.photo)
        expect(axiosMock.get).toHaveBeenCalledTimes(4)


    })
})


//server data generator mock

function* infiniteIndex() {
    let index = 0

    while (true) {
        yield index++
    }
}

function mockDataGeneratorMaker() {
    const indexGenerator = infiniteIndex()

    return (numberOfPhotos) => (
        {
            photo: Array(numberOfPhotos).fill(1).map(() => (
                {
                    id: indexGenerator.next().value,
                    title: "some photo",
                    url: "someUrl"
                }
            ))
        })
}

