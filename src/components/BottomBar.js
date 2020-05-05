import React from "react"
import PropTypes, {number} from 'prop-types'
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

export default function BottomBar({counter}) {
    const classes = useStyles()
return(
    <AppBar position={"fixed"} className={classes.timer}>
        <Typography align={"right"}>
            {`Last update from server was ${counter} s ago`}
        </Typography>
    </AppBar>
)
}

BottomBar.propTypes = {
    counter: number
}
