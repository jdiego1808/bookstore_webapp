import { Chart } from "react-google-charts";
import { Grid, Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    padding: "0",
    margin: "0"
  },
  charts: {
    width: "100%",
  }
});

const StatisticChart = ({ data }) => {
  const classes = useStyles();

  const salesData = data.map((m) => [m.month, m.numOfTrade]);
  salesData.unshift(["x", "Sales"]);

  const pricesData = data.map((m) => [m.month, m.totalPrice]);
  pricesData.unshift(["Month", "Total price"]);

  return (
    <Paper>
      <Grid container spacing={4} className={classes.root}>
        <Grid item xs={6} className={classes.charts}>
          <Chart
            chartType="LineChart"
            style={{ width: "100%", height: "300px" }}
            loader={<div>Loading Chart</div>}
            data={[...salesData]}
            options={{
              title: "Number of trade per month in 2021",
              hAxis: {
                title: "Month"
              },
              vAxis: {
                title: "Number of trade"
              }
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Chart
            chartType="BarChart"
            style={{ width: "100%", height: "300px" }}
            loader={<div>Loading Chart</div>}
            data={[...pricesData]}
            options={{
              title: "Total budget per month in 2021",
              hAxis: {
                title: "Total Budget",
                minValue: 0
              },
              vAxis: {
                title: "Month"
              }
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StatisticChart;
