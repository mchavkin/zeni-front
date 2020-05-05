import React, {useEffect, useRef} from "react"
import PropTypes, {func, number} from 'prop-types'
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles(theme => ({
    loader: {
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center'
    },
}))


export default function InfiniteScroller(props) {
    const classes = useStyles()
    const loadingRef = useRef(null)

    const observer = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) props.fetchEntries()
    })

    useEffect(() => {
        observer.observe(loadingRef.current)
    }, [])

    useEffect(() => {
        if (props.currentEntries >= props.maxEntries) {
            observer.unobserve(loadingRef.current)
        }
    }, [props, observer])


    return (
        <Paper ref={loadingRef} className={classes.loader}>
            {props.currentEntries < props.maxEntries ?
                <CircularProgress/>
                :
                <Typography align={"center"}>
                    {`You have ${props.maxEntries} photos loaded. Enough is enough!`}
                </Typography>
            }
        </Paper>
    )

}

InfiniteScroller.propTypes = {
    fetchEntries: func,
    maxEntries: number,
    currentEntries: number
}