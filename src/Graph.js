import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Line } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core/styles';
import trendlineLinear from 'chartjs-plugin-trendline';

const styles = theme => ({
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
});

class Graph extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      mode: 'boiler',
      tableData: JSON.parse(localStorage.getItem('tableData'))
    }
  }
  options = {
    responsive: true,
    maintainAspectRatio: false,
  }

  data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        pointBackgroundColor: "rgba(255, 0, 0, 1)",
        pointBorderColor: "rgba(255, 0, 0, 1)",
        showLine: false,
        lineTension: 0,
        data: [65, 59, 80, 0, 56, 55, 40],
        trendlineLinear: {
          style: "rgba(255,105,180, .8)",
          lineStyle: "dotted",
          width: 2
        }
      },
    ]
  }

  DATA_COL_INDEX = {
    DATE: 0,
    CRANE: 1,
    BAGGASES: 2,
    MOLASSES: 6,
    CRUDE_SUGAR: 8,
    SUGAR: 9,
    PURE_SUGAR: 10,
    EXTRA_PURE_SUGAR: 11,
    TOTAL_SUGAR: 12,
    TOTAL_ENERGY: 13,
    EVA_MILL: 14,
    HOT_MILL: 16,
    EVA_BOIL: 17,
    HOT_BOIL: 19,
    EVA_INPUT_TURBINE: 20,
    HOT_INPUT_TURBINE: 22,
    EVA_OUTPUT_TURBINE: 23,
    HOT_OUTPUT_TURBINE: 25,
  }

  totalCrane() {
    const date = this.state.tableData.map(row => row[0].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['CRANE']].value) ? parseFloat(row[this.DATA_COL_INDEX['CRANE']].value) : 0)

    return {
      labels: date,
      datasets: [
        {
          label: 'ปริมาณอ้อย(Ton)',
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
          showLine: false,
          lineTension: 0,
          data: data,
          trendlineLinear: {
            style: "rgba(255,105,180, .8)",
            lineStyle: "dotted",
            width: 2
          }
        },
      ]
    }
  }

  totalSugar() {
    const date = this.state.tableData.map(row => row[0].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['CRANE']].value) ? parseFloat(row[this.DATA_COL_INDEX['TOTAL_SUGAR']].value) : 0)

    return {
      labels: date,
      datasets: [
        {
          label: 'ปริมาณน้ำตาลทั้งหมด(Ton)',
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
          showLine: false,
          lineTension: 0,
          data: data,
          trendlineLinear: {
            style: "rgba(255,105,180, .8)",
            lineStyle: "dotted",
            width: 2
          }
        },
      ]
    }
  }

  heatToMilling() {
    const date = this.state.tableData.map(row => row[0].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['HOT_MILL']].value) ? parseFloat(row[this.DATA_COL_INDEX['HOT_MILL']].value) : 0)
    return {
      labels: date,
      datasets: [
        {
          label: 'พลังงานความร้อนป้อนขาเข้า(kWh)',
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
          showLine: false,
          lineTension: 0,
          data: data,
          trendlineLinear: {
            style: "rgba(255,105,180, .8)",
            lineStyle: "dotted",
            width: 2
          }
        },
      ]
    }
  }

  energyToMilling() {
    const date = this.state.tableData.map(row => row[0].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['EVA_MILL']].value) ? parseFloat(row[this.DATA_COL_INDEX['EVA_MILL']].value) : 0)
    return {
      labels: date,
      datasets: [
        {
          label: 'พลังงานไฟฟ้าขาเข้า(kWh)',
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
          showLine: false,
          lineTension: 0,
          data: data,
          trendlineLinear: {
            style: "rgba(255,105,180, .8)",
            lineStyle: "dotted",
            width: 2
          }
        },
      ]
    }
  }

  totalHeatGenerated() {
    const date = this.state.tableData.map(row => row[0].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['HOT_BOIL']].value) ? parseFloat(row[this.DATA_COL_INDEX['HOT_BOIL']].value) : 0)
    return {
      labels: date,
      datasets: [
        {
          label: 'พลังงานความร้อนที่เข้ากังหัน(kWh)',
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
          showLine: false,
          lineTension: 0,
          data: data,
          trendlineLinear: {
            style: "rgba(255,105,180, .8)",
            lineStyle: "dotted",
            width: 2
          }
        },
      ]
    }
  }

  heatToTurbine() {
    const date = this.state.tableData.map(row => row[0].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['HOT_INPUT_TURBINE']].value) ? parseFloat(row[this.DATA_COL_INDEX['HOT_INPUT_TURBINE']].value) : 0)
    return {
      labels: date,
      datasets: [
        {
          label: 'พลังงานความร้อนที่เข้ากังหัน(kWh)',
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
          showLine: false,
          lineTension: 0,
          data: data,
          trendlineLinear: {
            style: "rgba(255,105,180, .8)",
            lineStyle: "dotted",
            width: 2
          }
        },
      ]
    }
  }

  sugarToEnergy() {
    const rawData = this.state.tableData.map(
      row => {
        const sugar = parseFloat(row[this.DATA_COL_INDEX['TOTAL_SUGAR']].value) ? parseFloat(row[this.DATA_COL_INDEX['TOTAL_SUGAR']].value) : 0
        const energy = parseFloat(row[this.DATA_COL_INDEX['TOTAL_ENERGY']].value) ? parseFloat(row[this.DATA_COL_INDEX['TOTAL_ENERGY']].value) : 0
        return {sugar, energy}
      })

    console.log(` > rawData\n`, rawData)
    rawData.sort(({sugar: a}, {sugar: b}) => a < b)
    console.log(` > rawData\n`, rawData)
  }

  energyGenerated() {
    const date = this.state.tableData.map(row => row[0].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['HOT_INPUT_TURBINE']].value) ? parseFloat(row[this.DATA_COL_INDEX['HOT_INPUT_TURBINE']].value) : 0)
    return {
      labels: date,
      datasets: [
        {
          label: 'พลังงานความร้อนที่เข้ากังหัน(kWh)',
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
          showLine: false,
          lineTension: 0,
          data: data,
          trendlineLinear: {
            style: "rgba(255,105,180, .8)",
            lineStyle: "dotted",
            width: 2
          }
        },
      ]
    }
  }

  render() {
    const { classes } = this.props;


    return (
      <div className="body">
        <Grid className={classes.paper} container spacing={2} style={{ margin: 0, width: '100%', }}>
          <Grid item xs={12} style={{maxHeight: 400}}>
            <Typography variant="h4">พลังงาน / น้ำตาล</Typography>
            <Line data={this.sugarToEnergy()} options={this.options}/>
          </Grid>
          <Grid item xs={12} style={{maxHeight: 400, borderTop: 'solid 0.5px'}}>
            <select onChange={(e) => this.setState({mode: e.target.value})}>
              {
                [ {value: 'boiler', name: 'Boiler and Turbine'},
                  {value: 'milling', name: 'Milling house'},
                  {value: 'evap', name: 'Evaporation and crystallization'},
                ].map(
                  item => <option value={item.value}>{item.name}</option>)
              }
            </select>
          </Grid>
          {
            this.state.mode === 'boiler' ?
            <div style={{width: '100%'}}>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">พลังงานความร้อนที่ผลิตทั้งหมด</Typography>
                <Line data={this.totalHeatGenerated()} options={this.options}/>
              </Grid>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">พลังงานความร้อนที่เข้ากังหัน</Typography>
                <Line data={this.heatToTurbine()} options={this.options}/>
              </Grid>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">พลังไฟฟ้าที่ผลิต</Typography>
                <Line data={this.data} options={this.options}/>
              </Grid>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">พลังงานความร้อนเหลือทิ้ง</Typography>
                <Line data={this.data} options={this.options}/>
              </Grid>
            </div> :
            this.state.mode === 'milling' ?
            <div style={{width: '100%'}}>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">ปริมาณอ้อย</Typography>
                <Line data={this.totalCrane()} options={this.options}/>
              </Grid>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">พลังงานความร้อนป้อนขาเข้า</Typography>
                <Line data={this.heatToMilling()} options={this.options}/>
              </Grid>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">พลังไฟฟ้าป้อนเข้า</Typography>
                <Line data={this.energyToMilling()} options={this.options}/>
              </Grid>
            </div> :
            this.state.mode === 'evap' ?
            <div style={{width: '100%'}}>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">พลังงานความร้อนป้อนเข้า</Typography>
                <Line data={this.totalHeatGenerated()} options={this.options}/>
              </Grid>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">พลังงานไฟฟ้าขาเข้า</Typography>
                <Line data={this.heatToTurbine()} options={this.options}/>
              </Grid>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">น้ำหนักอ้อย</Typography>
                <Line data={this.totalCrane()} options={this.options}/>
              </Grid>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">Total sugar</Typography>
                <Line data={this.totalSugar()} options={this.options}/>
              </Grid>
            </div> : <div></div>

          }
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Graph);