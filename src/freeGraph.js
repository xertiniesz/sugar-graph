import { continueStatement } from '@babel/types'
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Line } from 'react-chartjs-2';
import trendlineLinear from 'chartjs-plugin-trendline';
import { withStyles } from '@material-ui/core/styles';

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
  typo: {
    float: 'left',
    textAlign: 'center',
    lineHeight: '2em'
  },
  select: {
    width: '15%',
    height: '3em',
    marginTop: 5,
    float: 'left'
  }
});

const StyledInput = withStyles({
  input: {
    textAlign: 'center',
    fontSize: '2rem'
  }
})(Input);

class FreeGraph extends React.Component {
  headers = ['วันที่', 'ปริมาณอ้อย (ตัน)', 'Baggases', '%Pol Baggases', 'Filtercake','%Pol Filtercake', 'Molasses', '%Pol Molasses',
    'น้ำตาลทรายดิบ (ตัน)','น้ำตาลทรายขาว (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์ (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์พิเศษ (ตัน)',
    'น้ำตาลรวม (ตัน)', 'พลังงานไฟฟ้าในกระบวนการผลิต (kWh)', 'ปริมาณไอน้ำในกระบวนการหีบอ้อย (ตัน/ชั่วโมง)', 'เอนทาลปีในกระบวนการหีบอ้อย (kJ/kg)', 'พลังงานความร้อนที่ใช้ในกระบวนการหีบอ้อย (kWh)',
    'ปริมาณไอน้ำหม้อต้มน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปีหม้อต้มน้ำ (kJ/kg)', 'พลังงานความร้อนจากไอน้ำหม้อต้มน้ำ (kWh)', 'ปริมาณไอน้ำขาเข้ากังหันไอน้ำ (ตัน/ชั่วโมง)',' เอนทาลปีขาเข้ากังหันไอน้ำ (kJ/kg)',
    'พลังงานความร้อนที่ใช้ขาเข้ากังหันไอน้ำ (kWh)', 'ปริมาณไอน้ำขาออกกังหันไอน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปีขาออกกังหันไอน้ำ (kJ/kg)', 'พลังงานความร้อนที่ใช้ขาออกกังหันไอน้ำ (kWh)', 'พลังงานความร้อนรวม (kWh)'];

  energy = ['พลังงานไฟฟ้าในกระบวนการผลิต (kWh)', 'ปริมาณไอน้ำในกระบวนการหีบอ้อย (ตัน/ชั่วโมง)', 'เอนทาลปีในกระบวนการหีบอ้อย (kJ/kg)',
            'พลังงานความร้อนที่ใช้ในกระบวนการหีบอ้อย (kWh)', 'ปริมาณไอน้ำหม้อต้มน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปีหม้อต้มน้ำ (kJ/kg)',
            'พลังงานความร้อนจากไอน้ำหม้อต้มน้ำ (kWh)', 'ปริมาณไอน้ำขาเข้ากังหันไอน้ำ (ตัน/ชั่วโมง)',' เอนทาลปีขาเข้ากังหันไอน้ำ (kJ/kg)',
            'พลังงานความร้อนที่ใช้ขาเข้ากังหันไอน้ำ (kWh)', 'ปริมาณไอน้ำขาออกกังหันไอน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปีขาออกกังหันไอน้ำ (kJ/kg)',
            'พลังงานความร้อนที่ใช้ขาออกกังหันไอน้ำ (kWh)', 'พลังงานความร้อนรวม (kWh)']
  product = ['ปริมาณอ้อย (ตัน)', 'Baggases', '%Pol Baggases', 'Filtercake','%Pol Filtercake', 'Molasses', '%Pol Molasses',
            'น้ำตาลรวม (ตัน)', 'น้ำตาลทรายดิบ (ตัน)','น้ำตาลทรายขาว (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์ (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์พิเศษ (ตัน)']

  options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          type: 'logarithmic',
          callback: (value, index, values) => {
            return value.toLocaleString()
          }
        }
      }],
      xAxes: [{
        ticks: {
          type: 'logarithmic',
          callback: (value, index, values) => {
            return value.toLocaleString()
          }
        }
      }]
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      tableData: [],
      companyName: '',
      loadCompleted: false,
      selectedHeader: 'ปริมาณอ้อย (ตัน)',
      selectedEnergy: 'พลังงานไฟฟ้าในกระบวนการผลิต (kWh)',
      selectedProduct: 'น้ำตาลรวม (ตัน)',
    }
  }

  componentWillMount() {
    const tableData = []
    this.props.db.find({target: 1})
      .then(
        data => {
          if (data[0]) {
            data[0].data.forEach(row => {
              tableData.push(row.map(ele => ele.value))
            })
          }
          this.props.db.findOne({target: 'companyName'})
            .then(name => {
              this.setState({tableData, companyName: name ? name.data : 'กดตรงนี้เพื่อเปลี่ยนชื่อบริษัท', loadCompleted: true})
            })
        }
      )
  }

  getDataByHeader(header, label = 'วันที่') {
    const headerIndex = this.headers.indexOf(header)
    const labelIndex = this.headers.indexOf(label)

    const labels = []
    const data = []

    if (label !== 'วันที่') {
      const tmpData = []
      this.state.tableData.forEach(row => {
        tmpData.push({
          x: Number.isFinite(parseFloat(row[labelIndex])) ? parseFloat(row[labelIndex]) : null,
          y: Number.isFinite(parseFloat(row[headerIndex])) ? parseFloat(row[headerIndex]) : null})
      })

      tmpData.sort((a, b) => a.x - b.x)

      tmpData.forEach(point => {
        if (point.x !== null) {
          labels.push(point.x)
          data.push(point.y)
        }
      })
    }
    else {
      this.state.tableData.forEach(row => {
        data.push(Number.isFinite(parseFloat(row[headerIndex])) ? parseFloat(row[headerIndex]) : null)
      })
      this.state.tableData.forEach(row => {
        labels.push(row[labelIndex])
      })
    }

    return {
      labels: labels,
      datasets: [
        {
          label: header,
          showLine: false,
          fill: false,
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

  render() {
    const { classes } = this.props;
    const renderComponent = this.state.loadCompleted ?
    <Grid className={classes.paper} container spacing={2} justify="center">
      <Grid item style={{maxHeight: 400}}>
        <StyledInput
          defaultValue={this.state.companyName}
          disableUnderline={true}
          inputProps={{
            'aria-label': 'description',
          }}
          onChange={(e) => this.props.db.update({target: 'companyName'}, {target: 'companyName', data: e.target.value}, {upsert: true})}
        />
      </Grid>
      {/*<Grid item xs={12}>*/}
      {/*  <Typography g variant="h5">ข้อมูล: </Typography>*/}
      {/*  <select className={classes.select} onChange={(e) => this.setState({selectedHeader: e.target.value})}>*/}
      {/*    {this.headers.slice(1).map(ele => <option value={ele}>{ele}</option>)}*/}
      {/*  </select>*/}
      {/*  <Line data={this.getDataByHeader(this.state.selectedHeader)} options={this.options}/>*/}
      {/*</Grid>*/}
      <Grid item xs={12} style={{borderTop: 'solid .5px'}}>
        <Typography className={classes.typo} variant="h5">{`พลังงาน: `}</Typography>
        <select className={classes.select} onChange={(e) => this.setState({selectedEnergy: e.target.value})}>
          {this.energy.map(ele => <option value={ele}>{ele}</option>)}
        </select>
        <Typography className={classes.typo} variant="h5">ผลผลิต: </Typography>
        <select className={classes.select} onChange={(e) => this.setState({selectedProduct: e.target.value})}>
          {this.product.map(ele => <option value={ele}>{ele}</option>)}
        </select>
        <Line data={this.getDataByHeader(this.state.selectedProduct, this.state.selectedEnergy)} options={this.options}/>
      </Grid>
    </Grid> :
    <LinearProgress />
    return (
      <div className="body">
        {renderComponent}
      </div>
    )
  }
}

export default withStyles(styles)(FreeGraph)
