import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Line } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core/styles';
import trendlineLinear from 'chartjs-plugin-trendline';
// const DataStore = require('nedb-promises');

// const db = DataStore.create({
//   filename: `./electron.db`,
//   timestampData: true,
//   autoload: true
// });

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
    let tableData = []
    const data = [[{value: '11/02/62'},{value: 11788},{value: 3510},{value: 2.26},{value: 411.33},{value: 4.88},{value: 450.00},{value: 27.13},{value: 635},{value: 444},{value: 434},{value: 0},{value: 1513},{value: 270580},{value: 2318},{value: 3210},{value: 2067240},{value: 6032},{value: 3210},{value: 5378533},{value: 3149},{value: 3210},{value: 2807680},{value: 3149},{value: 2806},{value: 2454315},{value: 5025168}],
      [{value: '12/02/62'},{value: 11839},{value: 3456},{value: 2.17},{value: 443.79},{value: 5.00},{value: 577.21},{value: 27.05},{value: 1084},{value: 102},{value: 4},{value: 0},{value: 1190},{value: 250920},{value: 2081},{value: 3210},{value: 1855380},{value: 5746},{value: 3210},{value: 5123517},{value: 2743},{value: 3210},{value: 2446020},{value: 2743},{value: 2806},{value: 2138172},{value: 4815669}],
      [{value: '14/02/62'},{value: 13851},{value: 4203},{value: 2.29},{value: 494.60},{value: 5.16},{value: 647.18},{value: 26.58},{value: 468},{value: 646},{value: 260},{value: 0},{value: 1374},{value: 286440},{value: 2364},{value: 3210},{value: 2107900},{value: 6795},{value: 3210},{value: 6058875},{value: 3305},{value: 3210},{value: 2946780},{value: 3305},{value: 2806},{value: 2575908},{value: 5688003}],]

    data.forEach(
      (row, index) => {tableData.push([{value: index + 1, readOnly: true}, ...row])}
    )

    this.state = {
      mode: 'boiler',
      tableData
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

  // componentWillMount() {
  //   db.find({target: 1})
  //     .then( data => {
  //       const tableData = this.state.tableData
  //       data[0].data.forEach(
  //         (row, index) => {tableData.push([{value: index + 1, readOnly: true}, ...row])}
  //       )
  //
  //       console.log('set')
  //       this.setState({tableData, date: tableData[0][1].value})
  //     })
  // }

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
    if (this.state.tableData)
    {const date = this.state.tableData.map(row => row[1].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['CRANE']+1].value) ? parseFloat(row[this.DATA_COL_INDEX['CRANE']+1].value) : 0)

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
    }}
  }

  totalSugar() {
    if (this.state.tableData)
    {const date = this.state.tableData.map(row => row[1].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['CRANE']+1].value) ? parseFloat(row[this.DATA_COL_INDEX['TOTAL_SUGAR']+1].value) : 0)

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
    }}
  }

  heatToMilling() {
    if (this.state.tableData)
    {const date = this.state.tableData.map(row => row[1].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['HOT_MILL']+1].value) ? parseFloat(row[this.DATA_COL_INDEX['HOT_MILL']+1].value) : 0)
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
    }}
  }

  energyToMilling() {
    if (this.state.tableData)
    {const date = this.state.tableData.map(row => row[1].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['EVA_MILL']+1].value) ? parseFloat(row[this.DATA_COL_INDEX['EVA_MILL']+1].value) : 0)
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
    }}
  }

  totalHeatGenerated() {
    if (this.state.tableData)
    {const date = this.state.tableData.map(row => row[1].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['HOT_BOIL']+1].value) ? parseFloat(row[this.DATA_COL_INDEX['HOT_BOIL']+1].value) : 0)
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
    }}
  }

  heatToTurbine() {
    if (this.state.tableData)
    {const date = this.state.tableData.map(row => row[1].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['HOT_INPUT_TURBINE']+1].value) ? parseFloat(row[this.DATA_COL_INDEX['HOT_INPUT_TURBINE']+1].value) : 0)
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
    }}
  }

  sugarToEnergy() {
    if (this.state.tableData)
    {
      const date = this.state.tableData.map(row => row[1].value)
      const sugar = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['TOTAL_SUGAR']+1].value) ? parseFloat(row[this.DATA_COL_INDEX['TOTAL_SUGAR']+1].value) : 0)
      const energy = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['TOTAL_ENERGY']+1].value) ? parseFloat(row[this.DATA_COL_INDEX['TOTAL_ENERGY']+1].value) : 0)
      console.log(` > suag\n`, sugar)
      console.log(` > suag\n`, energy)
      return {
        labels: date,
        datasets: [
          {
            label: 'sugar',
            pointBackgroundColor: "rgba(255, 0, 0, 1)",
            pointBorderColor: "rgba(255, 0, 0, 1)",
            showLine: true,
            lineTension: 1,
            id: 'sugar',
            data: sugar,
          },
          {
            label: 'Energy(kWh)',
            pointBackgroundColor: "rgba(0, 255, 0, 1)",
            pointBorderColor: "rgba(0, 255, 0, 1)",
            showLine: true,
            lineTension: 1,
            id: 'energy',
            data: energy,
          },
        ],
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true,
            position: "left",
            id: "sugar",
          }, {
            stacked: false,
            position: "right",
            id: "energy",
          }]
        }
      }
    }
  }

  energyGenerated() {
    if (this.state.tableData)
    {const date = this.state.tableData.map(row => row[1].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['HOT_INPUT_TURBINE']+1].value) ? parseFloat(row[this.DATA_COL_INDEX['HOT_INPUT_TURBINE']+1].value) : 0)
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
    }}
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