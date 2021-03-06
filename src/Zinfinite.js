import React, {useEffect, useReducer, useRef, useState} from "react"
import axios from "axios"
import TopBar from "./components/TopBar/TopBar";
import InfiniteScroller from "./components/InfiniteScroller/InfiniteScroller";
import BottomBar from "./components/BottomBar/BottomBar";
import Album from "./components/Album/Album";


const url = 'http://localhost:3300/'
const photoInit = {
    lastEvent: '',
    photos: [],
    newPhotoCount: 0,
}

const photoReducer = (state, action) => {
    const filteredPhotos = action.data.photo
        .filter(newPhotos => !state.photos.some(oldPhotos => oldPhotos.id === newPhotos.id))
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
    const [updatedPhotos, setUpdatedPhotos] = useState(0)
    const [resetCounter, setResetCounter] = useState(Date.now())

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
    }, [])

    useEffect(() => {
        if (photos.lastEvent === 'update' && photos.newPhotoCount) {
            pageToLoad.current = Math.ceil((photos.photos.length + 1) / 10)
            setUpdatedPhotos(photos.newPhotoCount)
            setResetCounter(Date.now())
        } else if (photos.lastEvent === 'nextPage') {
            ++pageToLoad.current
            if (!photos.newPhotoCount) fetchNextPage()
        }
    }, [photos])


    return (
        <>
            <TopBar totalPhotos={photos.photos.length} recentPhotos={updatedPhotos}/>
            <Album photos={photos.photos}/>
            <InfiniteScroller currentEntries={photos.photos.length} maxEntries={500} fetchEntries={fetchNextPage}/>
            <BottomBar reset={resetCounter}/>
        </>
    )
}