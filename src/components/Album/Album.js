import React from "react"
import PropTypes, {array} from 'prop-types'
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
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
    }
}))

export default function Album({photos}) {
    const classes = useStyles()
return(
    <div className={classes.album}>
        {photos.map(photo =>
            <Paper className={classes.paper} key={photo.id} data-testid="photo-with-description">
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
    </div>
)
}

Album.propTypes = {
    photos: array
}