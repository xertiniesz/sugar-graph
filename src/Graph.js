import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Line } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core/styles';
import trendlineLinear from 'chartjs-plugin-trendline';

const headers = ['', 'วันที่', 'ปริมาณอ้อย (ตัน)', 'Baggases', '%Pol Baggases', 'Filtercake','%Pol Baggases', 'Molasses', '%Pol Molasses',
  'น้ำตาลทรายดิบ (ตัน)','น้ำตาลทรายขาว (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์ (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์พิเศษ (ตัน)',
  'น้ำตาลรวม (ตัน)', 'พลังงานไฟฟ้าในกระบวนการผลิต (kWh)', 'ปริมาณไอน้ำในกระบวนการหีบอ้อย (ตัน/ชั่วโมง)', 'เอนทาลปีในกระบวนการหีบอ้อย (kJ/kg)', 'พลังงานความร้อนที่ใช้ในกระบวนการหีบอ้อย (kWh)',
  'ปริมาณไอน้ำหม้อต้มน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปีหม้อต้มน้ำ (kJ/kg)', 'พลังงานความร้อนจากไอน้ำหม้อต้มน้ำ (kWh)', 'ปริมาณไอน้ำขาเข้ากังหันไอน้ำ (ตัน/ชั่วโมง)',' เอนทาลปีขาเข้ากังหันไอน้ำ (kJ/kg)',
  'พลังงานความร้อนที่ใช้ขาเข้ากังหันไอน้ำ (kWh)', 'ปริมาณไอน้ำขาออกกังหันไอน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปีขาออกกังหันไอน้ำ (kJ/kg)', 'พลังงานความร้อนที่ใช้ขาออกกังหันไอน้ำ (kWh)', 'พลังงานความร้อนรวม (kWh)'];

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
      tableData: []
    }
  }

  options = {
    responsive: true,
    maintainAspectRatio: false,
  }

  mixedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'sugar',
          scaleLabel: {
            display: true,
            labelString: 'น้ำตาล'
          }
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'energy',
          scaleLabel: {
            display: true,
            labelString: 'พลังงาน'
          }
        },
      ]
    }
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

  componentWillMount() {
    this.props.db.find({target: 1})
      .then( data => {
        const tableData = this.state.tableData
        data[0].data.forEach(
          (row, index) => {tableData.push([{value: index + 1, readOnly: true}, ...row])}
        )

        this.setState({tableData})
      })
  }

  DATA_COL_INDEX = {
    DATE: 0,
    CRANE: 1,
    BAGGASES: 2,
    FILTER_CAKE: 4,
    MOLASSES: 6,
    CRUDE_SUGAR: 8,
    SUGAR: 9,
    PURE_SUGAR: 10,
    EXTRA_PURE_SUGAR: 11,
    TOTAL_SUGAR: 12,
    TOTAL_ENERGY: 13,
    EVA_MILL: 14,
    HOT_MILL: 16,
    EVA_EVAP: 17,
    HOT_EVAP: 19,
    EVA_INPUT_TURBINE: 20,
    HOT_INPUT_TURBINE: 22,
    EVA_OUTPUT_TURBINE: 23,
    ENTHALPY_OUTPUT_TURBINE: 24,
    HOT_OUTPUT_TURBINE: 25,
    TOTAL_HEAT: 26,
  }

  getGraphDataByHeader(header) {
    const headerIndex = headers.indexOf(header)

    const date = this.state.tableData.map(row => row[1].value)
    const data = this.state.tableData.map(row => Number.isFinite(row[headerIndex].value) ? row[headerIndex].value : null)

    return {
      labels: date,
      datasets: [
        {
          label: header,
          fill: false,
          showLine: false,
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(255, 0, 0, 1)",
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
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

  totalCrane() {
    if (this.state.tableData)
    {const date = this.state.tableData.map(row => row[1].value)
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['CRANE']+1].value) ? parseFloat(row[this.DATA_COL_INDEX['CRANE']+1].value) : 0)

    return {
      labels: date,
      datasets: [
        {
          label: 'ปริมาณอ้อย(Ton)',
          fill: false,
          showLine: false,
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(255, 0, 0, 1)",
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
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
          fill: false,
          showLine: false,
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(255, 0, 0, 1)",
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
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
          fill: false,
          showLine: false,
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(255, 0, 0, 1)",
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
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
          fill: false,
          showLine: false,
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(255, 0, 0, 1)",
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
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
    const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['TOTAL_HEAT']+1].value) ? parseFloat(row[this.DATA_COL_INDEX['TOTAL_HEAT']+1].value) : 0)
    return {
      labels: date,
      datasets: [
        {
          label: 'พลังงานความร้อน(kWh)',
          fill: false,
          showLine: false,
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(255, 0, 0, 1)",
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
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
          fill: false,
          showLine: false,
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(255, 0, 0, 1)",
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
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
            type:'line',
            data: sugar,
            fill: false,
            lineTension: 0,
            borderColor: "rgba(255, 0, 0, 1)",
            backgroundColor: "rgba(255, 0, 0, 1)",
            pointBackgroundColor: "rgba(255, 0, 0, 1)",
            pointBorderColor: "rgba(255, 0, 0, 1)",
            yAxisID: 'sugar',
          },
          {
            label: 'Energy(kWh)',
            type:'line',
            data: energy,
            fill: false,
            lineTension: 0,
            borderColor: "rgba(0, 255, 0, 1)",
            backgroundColor: "rgba(0, 255, 0, 1)",
            pointBackgroundColor: "rgba(0, 255, 0, 1)",
            pointBorderColor: "rgba(0, 255, 0, 1)",
            yAxisID: 'energy',
          },
        ],
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
          fill: false,
          showLine: false,
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(255, 0, 0, 1)",
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
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

  totalEnergy() {
    if (this.state.tableData)
    {const date = this.state.tableData.map(row => row[1].value)
      const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['TOTAL_ENERGY']+1].value) ? parseFloat(row[this.DATA_COL_INDEX['TOTAL_ENERGY']+1].value) : 0)
      return {
        labels: date,
        datasets: [
          {
            label: 'พลังงานไฟฟ้า(kWh)',
            fill: false,
            showLine: false,
            borderColor: "rgba(255, 0, 0, 1)",
            backgroundColor: "rgba(255, 0, 0, 1)",
            pointBackgroundColor: "rgba(255, 0, 0, 1)",
            pointBorderColor: "rgba(255, 0, 0, 1)",
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
  }

  heatOutTurbine() {
    if (this.state.tableData)
    {const date = this.state.tableData.map(row => row[1].value)
      const data = this.state.tableData.map(row => parseFloat(row[this.DATA_COL_INDEX['HOT_OUTPUT_TURBINE']+1].value) ? parseFloat(row[this.DATA_COL_INDEX['HOT_OUTPUT_TURBINE']+1].value) : 0)
      return {
        labels: date,
        datasets: [
          {
            label: 'พลังงานความร้อน(kWh)',
            fill: false,
            showLine: false,
            borderColor: "rgba(255, 0, 0, 1)",
            backgroundColor: "rgba(255, 0, 0, 1)",
            pointBackgroundColor: "rgba(255, 0, 0, 1)",
            pointBorderColor: "rgba(255, 0, 0, 1)",
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
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="body">
        <Grid className={classes.paper} container spacing={2} style={{ margin: 0, width: '100%', }}>
          <Grid item xs={12} style={{maxHeight: 400}}>
            <Typography variant="h4">พลังงาน / น้ำตาล</Typography>
            <Line data={this.sugarToEnergy()} options={this.mixedOptions}/>
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
                <Line data={this.getGraphDataByHeader('พลังงานความร้อนรวม (kWh)')} options={this.options}/>
              </Grid>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">พลังงานความร้อนที่เข้ากังหัน</Typography>
                <Line data={this.getGraphDataByHeader('พลังงานความร้อนที่ใช้ขาเข้ากังหันไอน้ำ (kWh)')} options={this.options}/>
              </Grid>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">พลังไฟฟ้าที่ผลิต</Typography>
                <Line data={this.totalEnergy()} options={this.options}/>
              </Grid>
              <Grid item xs={12} style={{maxHeight: 400}}>
                <Typography variant="h4">พลังงานความร้อนเหลือทิ้ง</Typography>
                <Line data={this.heatOutTurbine()} options={this.options}/>
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
                <Line data={this.totalEnergy()} options={this.options}/>
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
                <Line data={this.totalEnergy()} options={this.options}/>
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