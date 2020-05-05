import React, {useEffect, useReducer, useRef, useState} from "react"
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import axios from "axios"
import AppBar from "@material-ui/core/AppBar";


const url = 'http://localhost:3300/'
const photoInit = {
    lastEvent: '',
    photos: [],
    newPhotoCount: 0,
}

const useStyles = makeStyles((theme) => ({
    album: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto'
    },
    image: {
        display: "block",
        margin: 'auto'
    },
    loader: {
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center'
    },
    timer: {
        top: 'auto',
        bottom: 0,
        paddingRight: theme.spacing(2)
    },
    appBar: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    }
}))

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
    const classes = useStyles()

    const [photos, dispatchPhotos] = useReducer(photoReducer, photoInit)
    const [lastUpdateCounter, setLastUpdateCounter] = useState(0)

    const loadingRef = useRef(null)
    const pageToLoad = useRef(1)

    const fetchNextPage = nextPage => {
        axios.get(`${url}nextPage`, {
            params: {page: nextPage}
        }).then(({data}) => {
            dispatchPhotos({type: 'nextPage', data})
        })
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) {
            fetchNextPage(pageToLoad.current)
        }
    })


    useEffect(() => {
        observer.observe(loadingRef.current)

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
            if (!photos.newPhotoCount) fetchNextPage(pageToLoad.current)
        }

        if (photos.photos.length === 500) {
            observer.unobserve(loadingRef.current)
        }
    }, [photos])


    return (
        <>
            <AppBar position="sticky" className={classes.appBar}>
                <Typography variant={"h6"}>
                    {`Total loaded photos: ${photos.photos.length}`}
                </Typography>
                <Typography variant={"h6"}>
                    {`Updated recent photos (top): ${photos.newPhotoCount}`}
                </Typography>
            </AppBar>

            <div className={classes.album}>
                {photos.photos.map(photo =>
                    <Paper className={classes.paper} key={photo.id}>
                        <Grid container direction={"row"} spacing={2}>
                            <Grid item xs={4} sm={3} md={2}>
                                <img src={photo.url} alt="thumb" className={classes.image}/>
                            </Grid>
                            <Grid item xs={8} sm={9} md={10}>
                                <Typography>
                                    {photo.title}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>)
                }

                <Paper ref={loadingRef} className={classes.loader}>
                    {photos.photos.length < 500 ?
                        <CircularProgress/>
                        :
                        <Typography align={"center"}>
                            You have 500 photos loaded. Enough is enough!
                        </Typography>
                    }
                </Paper>
                <AppBar position={"fixed"} className={classes.timer}>
                    <Typography align={"right"}>
                        {`Last update from server was ${lastUpdateCounter} s ago`}
                    </Typography>
                </AppBar>
            </div>
        </>
    )
}