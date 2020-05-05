import React, {useEffect, useReducer, useRef, useState} from "react"
import axios from "axios"
import TopBar from "./components/TopBar";
import InfiniteScroller from "./components/InfiniteScroller";
import BottomBar from "./components/BottomBar";
import Album from "./components/Album";


const url = 'http://localhost:3300/'
const photoInit = {
    lastEvent: '',
    photos: [],
    newPhotoCount: 0,
}

const photoReducer = (state, action) => {
    const filteredPhotos = action.data.photo.filter(np => !state.photos.some(op => op.id === np.id))
    switch (action.type) {
        case 'update': {
            return (
                {
                    lastEvent: 'update',
                    photos: [...filteredPhotos, ...state.photos].slice(0, 500),
                    newPhotoCount: filteredPhotos.length
                }
            )
        }
        case 'nextPage': {
            return (
                {
                    lastEvent: 'nextPage',
                    photos: [...state.photos, ...filteredPhotos].slice(0, 500),
                    newPhotoCount: filteredPhotos.length
                }
            )
        }
        default:
            throw new Error()
    }
}

export default function Zinfinite() {

    const [photos, dispatchPhotos] = useReducer(photoReducer, photoInit)
    const [lastUpdateCounter, setLastUpdateCounter] = useState(0)

    const pageToLoad = useRef(1)

    const fetchNextPage = () => {
        axios.get(`${url}nextPage`, {
            params: {page: pageToLoad.current}
        }).then(({data}) => {
            dispatchPhotos({type: 'nextPage', data})
        })
    }

    useEffect(() => {

        const events = new EventSource(`${url}stream`)
        events.onmessage = (ev) => {
            dispatchPhotos({type: 'update', data: JSON.parse(ev.data)})
        }

        setInterval(() => {
            setLastUpdateCounter(counter => counter + 1)
        }, 1000)

    }, [])

    useEffect(() => {
        if (photos.lastEvent === 'update' && photos.newPhotoCount) {
            pageToLoad.current = Math.ceil((photos.photos.length + 1) / 10)
            setLastUpdateCounter(0)
        } else if (photos.lastEvent === 'nextPage') {
            ++pageToLoad.current
            if (!photos.newPhotoCount) fetchNextPage()
        }
    }, [photos])


    return (
        <>
            <TopBar totalPhotos={photos.photos.length} recentPhotos={photos.newPhotoCount}/>
            <Album photos={photos.photos}/>
            <InfiniteScroller currentEntries={photos.photos.length} maxEntries={500} fetchEntries={fetchNextPage}/>
            <BottomBar counter={lastUpdateCounter}/>
        </>
    )
}