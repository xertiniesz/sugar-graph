import React from 'react';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
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
  },
  input: {
    margin: theme.spacing(1),
    height: 200
  },
  formControl: {
    borderTop: '1px solid',
  }
});

class Graph extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loadCompleted: false,
      companyName: '',
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
          display: true,
          position: 'left',
          id: 'sugar',
          scaleLabel: {
            display: true,
            labelString: 'น้ำตาลรวม (ตัน)'
          }
        },
        {
          display: true,
          position: 'right',
          id: 'energy',
          scaleLabel: {
            display: true,
            labelString: 'พลังงานไฟฟ้าในกระบวนการผลิต (kWh)'
          }
        },
      ]
    }
  }

  componentWillMount() {
    const tableData = []
    this.props.db.find({target: 1})
      .then( data => {
        if (data[0]) {
          data[0].data.forEach(
            (row, index) => {tableData.push([{value: index + 1, readOnly: true}, ...row])}
          )
        }
        this.props.db.findOne({target: 'companyName'})
          .then(name => {
            this.setState({tableData, companyName: name ? name.data : 'กดตรงนี้เพื่อเปลี่ยนชื่อบริษัท', loadCompleted: true})
          })
      })
  }

  getGraphDataByHeader(header) {
    const headerIndex = headers.indexOf(header)

    const date = this.state.tableData.map(row => row[1].value)
    const data = this.state.tableData.map(row => Number.isFinite(parseFloat(row[headerIndex].value)) ? parseFloat(row[headerIndex].value) : null)

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

  sugarToEnergy() {
    if (this.state.tableData)
    {
      const date = this.state.tableData.map(row => row[1].value)
      const sugar = this.state.tableData.map(row => parseFloat(row[headers.indexOf('น้ำตาลรวม (ตัน)')].value) ? parseFloat(row[headers.indexOf('น้ำตาลรวม (ตัน)')].value) : 0)
      const energy = this.state.tableData.map(row => parseFloat(row[headers.indexOf('พลังงานไฟฟ้าในกระบวนการผลิต (kWh)')].value) ? parseFloat(row[headers.indexOf('พลังงานไฟฟ้าในกระบวนการผลิต (kWh)')].value) : 0)

      return {
        labels: date,
        datasets: [
          {
            label: 'น้ำตาลรวม (ตัน)',
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
            label: 'พลังงานไฟฟ้าในกระบวนการผลิต (kWh)',
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

  render() {
    const { classes } = this.props;
    const renderComponent = this.state.loadCompleted ?
      <Grid className={classes.paper} justify="center" container spacing={2} style={{ margin: 0, width: '100%', }}>
        <Grid item style={{maxHeight: 400}}>
          <Input
            defaultValue={this.state.companyName}
            className={{root: classes.input, formControl: classes.formControl}}
            inputProps={{
              'aria-label': 'description',
            }}
            onChange={(e) => this.props.db.update({target: 'companyName'}, {target: 'companyName', data: e.target.value}, {upsert: true})}
          />
        </Grid>
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
              <Line data={this.getGraphDataByHeader('พลังงานไฟฟ้าในกระบวนการผลิต (kWh)')} options={this.options}/>
            </Grid>
            <Grid item xs={12} style={{maxHeight: 400}}>
              <Typography variant="h4">พลังงานความร้อนเหลือทิ้ง</Typography>
              <Line data={this.getGraphDataByHeader('พลังงานความร้อนที่ใช้ขาออกกังหันไอน้ำ (kWh)')} options={this.options}/>
            </Grid>
          </div> :
          this.state.mode === 'milling' ?
          <div style={{width: '100%'}}>
            <Grid item xs={12} style={{maxHeight: 400}}>
              <Typography variant="h4">ปริมาณอ้อย</Typography>
              <Line data={this.getGraphDataByHeader('ปริมาณอ้อย (ตัน)')} options={this.options}/>
            </Grid>
            <Grid item xs={12} style={{maxHeight: 400}}>
              <Typography variant="h4">พลังงานความร้อนป้อนขาเข้า</Typography>
              <Line data={this.getGraphDataByHeader('พลังงานความร้อนที่ใช้ในกระบวนการหีบอ้อย (kWh)')} options={this.options}/>
            </Grid>
            <Grid item xs={12} style={{maxHeight: 400}}>
              <Typography variant="h4">พลังไฟฟ้าป้อนเข้า</Typography>
              <Line data={this.getGraphDataByHeader('พลังงานไฟฟ้าในกระบวนการผลิต (kWh)')} options={this.options}/>
            </Grid>
          </div> :
          this.state.mode === 'evap' ?
          <div style={{width: '100%'}}>
            <Grid item xs={12} style={{maxHeight: 400}}>
              <Typography variant="h4">พลังงานความร้อนป้อนเข้า</Typography>
              <Line data={this.getGraphDataByHeader('พลังงานความร้อนรวม (kWh)')} options={this.options}/>
            </Grid>
            <Grid item xs={12} style={{maxHeight: 400}}>
              <Typography variant="h4">พลังงานไฟฟ้าขาเข้า</Typography>
              <Line data={this.getGraphDataByHeader('พลังงานไฟฟ้าในกระบวนการผลิต (kWh)')} options={this.options}/>
            </Grid>
            <Grid item xs={12} style={{maxHeight: 400}}>
              <Typography variant="h4">น้ำหนักอ้อย</Typography>
              <Line data={this.getGraphDataByHeader('ปริมาณอ้อย (ตัน)')} options={this.options}/>
            </Grid>
            <Grid item xs={12} style={{maxHeight: 400}}>
              <Typography variant="h4">Total sugar</Typography>
              <Line data={this.getGraphDataByHeader('น้ำตาลรวม (ตัน)')} options={this.options}/>
            </Grid>
          </div> : <div></div>

        }
      </Grid>
       :
      <LinearProgress />

    return (
      <div className="body">
        {renderComponent}
      </div>
    );
  }
}

export default withStyles(styles)(Graph);
