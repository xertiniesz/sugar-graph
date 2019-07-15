import React from 'react';
import logo from './Sugar.svg';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Line } from 'react-chartjs-2';

function Diagram() {
  const useStyles = makeStyles(theme => ({
    paper: {
      flexGlow: 1,
      width: '100%',
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    card: {
      minWidth: 600,
      padding: 10,
    },
    cardGraph: {
      minWidth: 600,
      padding: 10,
      minHeight: 200,
    }
  }));

  const classes = useStyles();
  const data = {
    labels: ['1','2','3','4','5'],
    datasets: [{
        label: 'Graph 1',
        type: 'line',
        data: [51, 65, 40, 49, 60],
        backgroundColor: '#EC932F',
        borderColor: '#EC932F',
        lineTension: 0,
        fill: false,
      },
      {
          label: 'Graph 2',
          type: 'line',
          data: [200, 185, 590, 621, 250],
          backgroundColor: '#71B37C',
          borderColor: '#71B37C',
          lineTension: 0,
          fill: false,
        },
    ]
  }

  const data1 = {
    labels: ['1','2','3','4','5'],
    datasets: [{
        label: 'Graph 2',
        type: 'line',
        data: [51, 65, 40, 49, 60],
        backgroundColor: '#EC932F',
        borderColor: '#EC932F',
        lineTension: 0,
        fill: false,
      },
    ]
  }

  const data2 = {
    labels: ['1','2','3','4','5'],
    datasets: [{
        label: 'Graph 3',
        type: 'line',
        data: [51, 65, 40, 49, 60],
        backgroundColor: '#EC932F',
        borderColor: '#EC932F',
        lineTension: 0,
        fill: false,
      },
    ]
  }

  const data3 = {
    labels: ['1','2','3','4','5'],
    datasets: [{
        label: 'Graph 4',
        type: 'line',
        data: [51, 65, 40, 49, 60],
        backgroundColor: '#EC932F',
        borderColor: '#EC932F',
        lineTension: 0,
        fill: false,
      },
    ]
  }
  const options = {
    responsive: true,
     maintainAspectRatio: false,
  }

  return(
    <div className="body">
      <Grid className={classes.paper} container spacing={2} style={{ margin: 0, width: '100%', }}>
        <Grid item xs={12}>
          <Card className={classes.cardGraph}>
            <Typography variant="h4">Diagram</Typography>
            <img src={logo} />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className={classes.cardGraph}>
            <Typography variant="h4">Graph</Typography>
            <Line data={data} options={options}/>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className={classes.cardGraph}>
            <Typography variant="h4">Graph 1</Typography>
            <Line data={data1} options={options}/>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className={classes.cardGraph}>
            <Typography variant="h4">Graph 2</Typography>
            <Line data={data2} options={options}/>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className={classes.cardGraph}>
            <Typography variant="h4">Graph 3</Typography>
            <Line data={data3} options={options}/>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Diagram;
