import "./styles.css";
import { Paper, Grid, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  greeting: {
    // fontFamily: "Montez, cursive",
    marginLeft: "40px"
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold"
  }
});

const Welcome = () => {
  const classes = useStyles();

  return (
    <Paper elevation={0}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography className={classes.greeting} variant="h5">
            Hello, Diego. Welcome back!
          </Typography>
          <Typography className={classes.greeting} variant="caption">
            Free speech is important.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.greeting} variant="subtitle1">
            Read the poem below and calm your mind.
          </Typography>
          <blockquote className="padding">
            <div className="blockquote-content padding">
              <p className="oblique">
                <span className={classes.title}>I'm not a patriot!</span>
                <br />
                <br />
                I came to the world as a humble man.
                <br />
                Talking was never my interest, but thinking.
                <br />
                I loved to stand in the darkness and look at the light,
                <br />
                For I could feel a little hope of life.
                <br />
                I enjoyed the sadness of living <br />
                to feed my mind on words and feelings.
                <br />
                <br />
                I was born in this country as a selfish one.
                <br />
                Loving this country as if it was mine only.
                <br />
                For the perverse who have tried to harm,
                <br />
                I wished them rotting in dishonor.
                <br />
                My heart was full of love but of the foolhardy.
                <br />
                <br />
                I grew up with suspicion and enmity.
                <br />
                In a community full of fraudsters,
                <br />
                I hated those who had taken away the old truthful life.
                <br />
                In a nation full of prohibitions, I've never believed in its democracy.
                <br />
                In a culture full of immorality, I have no longer wanted to be a civilian.
                <br />
                <br />
                But I’m hereby not a faithful patriot.
                <br />
                Cause I have no love for the perverse government.
                <br />
                I’m hereby a traitor as they named for those like me.
                <br />
                And my dear friends, the country I love is not an S-shaped land.
                <br />
                It’s us, the people.
                <br />
                And me, just a soldier.
                <br />
                <br />
                <b>- jdiego -</b>
              </p>
            </div>
          </blockquote>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Welcome;
