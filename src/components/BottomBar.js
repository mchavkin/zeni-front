import React, {useEffect, useState} from "react"
import PropTypes, {any, number} from 'prop-types'
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    timer: {
        top: 'auto',
        bottom: 0,
        paddingRight: theme.spacing(2)
    }
}))

export default function BottomBar({reset}) {
    const classes = useStyles()
    const [counterClock, setCounterClock] = useState(0)

    useEffect(() => {
        const intervalID = setInterval(() => {
            setCounterClock(count => count + 1)
        }, 1000)
    }, [])

    useEffect(() => {
        setCounterClock(0)
    }, [reset])

    return (
        <AppBar position={"fixed"} className={classes.timer}>
            <Typography align={"right"}>
                Last update from server was {counterClock} s ago
            </Typography>
        </AppBar>
    )
}

BottomBar.propTypes = {
    reset: any
}
