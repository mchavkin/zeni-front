import React from "react"
import PropTypes, {number} from 'prop-types'
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    appBar: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    }
}))

export default function TopBar(props) {
    const classes = useStyles()
    return (
        <AppBar position="sticky" className={classes.appBar}>
            <Typography variant={"h6"}>
                {`Total loaded photos: ${props.totalPhotos}`}
            </Typography>
            <Typography variant={"h6"}>
                {`Updated recent photos (top): ${props.recentPhotos}`}
            </Typography>
        </AppBar>
    )
}

TopBar.propTypes = {
    totalPhotos: number,
    recentPhotos: number
}

