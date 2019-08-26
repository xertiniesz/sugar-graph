import { Snackbar } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Line } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core/styles';
import config from './config'
import trendlineLinear from 'chartjs-plugin-trendline';

const headers = config.HEADERS

const StyledInput = withStyles({
  input: {
    textAlign: 'center',
    fontSize: '2rem'
  }
})(Input);

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
    textAlign: 'center',
    height: 200
  },
  formControl: {
    borderTop: '1px solid',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
});

class Graph extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loadCompleted: false,
      companyName: '',
      mode: 'boiler',
      tableData: [],
      openSnackBar: false,
      date: [],
      data1_1: headers[2],
      data2_1: headers[3],
      dateFrom_1: null,
      dateTo_1: null,
      data1_2: headers[2],
      data2_2: headers[3],
      dateFrom_2: null,
      dateTo_2: null,
      data1_3: headers[2],
      data2_3: headers[3],
      dateFrom_3: null,
      dateTo_3: null,
    }

    this.selectSetState = this.selectSetState.bind(this)
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this)
  }

  options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          type: 'logarithmic',
          callback: (value, index, values) => {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
        }
      }]
    }
  }

  mixedOptions(label1, label2) {
    return {
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
              labelString: label1
            },
            ticks: {
              maxTicksLimit: 5,
              type: 'logarithmic',
              callback: (value, index, values) => {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            }
          },
          {
            display: true,
            position: 'right',
            id: 'energy',
            scaleLabel: {
              display: true,
              labelString: label2
            },
            ticks: {
              maxTicksLimit: 5,
              type: 'logarithmic',
              callback: (value, index, values) => {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            }
          },
        ]
      }
    }
  }

  getDateArray(tableData) {
    return tableData.map(ele => ele[1].value)
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
            console.log(`tableData `, tableData)
            this.setState({tableData, companyName: name ? name.data : 'กดตรงนี้เพื่อเปลี่ยนชื่อบริษัท', date: this.getDateArray(tableData), loadCompleted: true})
          })
      })
  }

  // getGraphDataByHeader(header) {
  //   const headerIndex = headers.indexOf(header)
  //
  //   const date = this.state.tableData.map(row => row[1].value)
  //   const data = this.state.tableData.map(row => Number.isFinite(parseFloat(row[headerIndex].value)) ? parseFloat(row[headerIndex].value) : null)
  //   return {
  //     labels: date,
  //     datasets: [
  //       {
  //         label: header,
  //         fill: false,
  //         showLine: false,
  //         borderColor: "rgba(255, 0, 0, 1)",
  //         backgroundColor: "rgba(255, 0, 0, 1)",
  //         pointBackgroundColor: "rgba(255, 0, 0, 1)",
  //         pointBorderColor: "rgba(255, 0, 0, 1)",
  //         lineTension: 0,
  //         data: data,
  //         trendlineLinear: {
  //           style: "rgba(255,105,180, .8)",
  //           lineStyle: "dotted",
  //           width: 2
  //         }
  //       },
  //     ]
  //   }
  // }

  graphDataTemplate(labels, data1, label1, data2, label2) {
    return {
      labels,
      datasets: [
        {
          label: label1,
          type:'line',
          data: data1,
          fill: false,
          lineTension: 0,
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(255, 0, 0, 1)",
          pointBackgroundColor: "rgba(255, 0, 0, 1)",
          pointBorderColor: "rgba(255, 0, 0, 1)",
          yAxisID: 'sugar',
        },
        {
          label: label2,
          type:'line',
          data: data2,
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

  getGraphDateBySeries(series) {
    const dateFrom = this.state[`dateFrom_${series}`]
    const dateTo = this.state[`dateTo_${series}`]
    const rangeData = this.state.tableData.slice(dateFrom, dateTo+1)

    const index1 = headers.indexOf(this.state[`data1_${series}`])
    const index2 = headers.indexOf(this.state[`data2_${series}`])

    const date = rangeData.map(row => row[1].value)
    const data1 = rangeData.map(row =>
        Number.isFinite(parseFloat(row[index1].value)) ?
        parseFloat(row[index1].value) :
        row[index1].value
    )
    const data2 = rangeData.map(row =>
        Number.isFinite(parseFloat(row[index2].value)) ?
        parseFloat(row[index2].value) :
        row[index2].value
    )

    return this.graphDataTemplate(date, data1, this.state[`data1_${series}`], data2, this.state[`data2_${series}`])
  }

  getRemoveSelectedList(header) {
    const noBlank = headers.slice(2)
    const selectedIndex = noBlank.indexOf(header)

    if (selectedIndex >= 0) {
      noBlank.splice(selectedIndex, 1)
      return noBlank
    }

    return headers
  }

  sugarToEnergy() {
    if (this.state.tableData)
    {
      const date = this.state.tableData.map(row => row[1].value)
      const sugar = this.state.tableData.map(row => parseFloat(row[headers.indexOf('น้ำตาลรวม (ตัน)')].value) ? parseFloat(row[headers.indexOf('น้ำตาลรวม (ตัน)')].value) : 0)
      const energy = this.state.tableData.map(row => parseFloat(row[headers.indexOf('พลังงานไฟฟ้าในกระบวนการผลิต (kWh)')].value) ? parseFloat(row[headers.indexOf('พลังงานไฟฟ้าในกระบวนการผลิต (kWh)')].value) : 0)

      console.log(this.graphDataTemplate(date, sugar, 'น้ำตาลรวม (ตัน)', energy, 'พลังงานไฟฟ้าในกระบวนการผลิต (kWh)'))

      return this.graphDataTemplate(date, sugar, 'น้ำตาลรวม (ตัน)', energy, 'พลังงานไฟฟ้าในกระบวนการผลิต (kWh)')
    }
  }

  selectSetState(event) {
    const targetId = event.target.id
    const targetValue = event.target.value
    const index = headers.indexOf(targetValue)
    const data = this.state.tableData.map(row => row[index])
    const isAllElementFalsy = data.reduce((result, curr) => result && (!(curr === 0) && !curr), true)

    if (targetId.match('data') && isAllElementFalsy) {
      this.setState({openSnackBar: true})
      return
    }

    this.setState({[targetId]: targetValue})
  }

  handleSnackBarClose() {
    this.setState({openSnackBar: false})
  }

  graph(series) {
    return (
      <div>
        <div style={{display: 'flex'}}>
          <Typography variant="h6">ข้อมูล 1</Typography>
          <select onChange={this.selectSetState} id={`data1_${series}`} style={{marginLeft: '10px', maxWidth: '150px'}}>
            {
              this.getRemoveSelectedList(this.state[`data2_${series}`])
                  .map((ele, index) =>
                      <option
                          key={index}
                          value={ele}
                          selected={ele === this.state[`data1_${series}`]}
                      >
                        {ele}
                      </option>
                  )
            }
          </select>
          <Typography variant="h6" style={{marginLeft: '10px'}}>ข้อมูล 2</Typography>
          <select onChange={this.selectSetState} id={`data2_${series}`} style={{marginLeft: '10px', maxWidth: '150px'}}>
            {
              this.getRemoveSelectedList(this.state[`data1_${series}`])
                  .map((ele, index) =>
                      <option
                          key={index}
                          value={ele}
                          selected={ele === this.state[`data2_${series}`]}
                      >
                        {ele}
                      </option>
                  )
            }
          </select>
          <Typography variant="h6" style={{marginLeft: '10px'}}>วันที่ จาก</Typography>
          <select onChange={this.selectSetState} id={`dateFrom_${series}`} style={{marginLeft: '10px'}}>
            {
              this.state.date.map((date, index) =>
                  <option
                      value={index}
                      selected={this.state[`dateFrom_${series}`] === index}
                  >
                    {date}
                  </option>
              )
            }
          </select>
          <Typography variant="h6" style={{marginLeft: '10px'}}>ถึง</Typography>
          <select onChange={this.selectSetState} id={`dateTo_${series}`} style={{marginLeft: '10px', justifyContent: 'flex-end'}}>
            {
              this.state.date.map((date, index) =>
                  <option
                      value={index}
                      selected={this.state[`dateTo_${series}`] === index}
                  >
                    {date}
                  </option>
              )
            }
          </select>
        </div>
        <Line data={this.getGraphDateBySeries(series)} options={this.mixedOptions(this.state[`data1_${series}`], this.state[`data1_${series}`])}/>
      </div>
    )
  }

  render() {
    const { classes } = this.props;

    const renderComponent = this.state.loadCompleted ?
      <Grid className={classes.paper} justify="center" container spacing={2} style={{ margin: 0, width: '100%', }}>
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
        <Grid item xs={12} style={{maxHeight: 400}}>
          <Typography variant="h4">พลังงาน / น้ำตาล</Typography>
          <Line data={this.sugarToEnergy()} options={this.mixedOptions('น้ำตาลรวม (ตัน)', 'พลังงานไฟฟ้าในกระบวนการผลิต (kWh)')}/>
        </Grid>
        <Grid item xs={12} style={{maxHeight: 400, borderTop: 'solid 0.5px'}}>
          {this.graph(1)}
        </Grid>
        <Grid item xs={12} style={{maxHeight: 400, borderTop: 'solid 0.5px'}}>
          {this.graph(2)}
        </Grid>
        <Grid item xs={12} style={{maxHeight: 400, borderTop: 'solid 0.5px'}}>
          {this.graph(3)}
        </Grid>
      </Grid>
       :
      <LinearProgress />

    return (
      <div className="body">
        {renderComponent}
        <Snackbar
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          autoHideDuration={5000}
          open={this.state.openSnackBar}
          onClose={this.handleSnackBarClose}
        >
          <SnackbarContent
            className={classes.error}
            message={
              <span className={classes.message}>
                <ErrorIcon style={{paddingRight: '10px'}} />
                ไม่มีข้อมูล
              </span>
            }
            action={[
              <IconButton onClick={this.handleSnackBarClose}>
                <IconButton onClick={this.handleSnackBarClose} size="small">
                  <CloseIcon style={{fontSize: '20', color: 'white'}}/>
                </IconButton>
              </IconButton>
            ]}
          />
        </Snackbar>
      </div>
    );
  }
}

/*
{
  <Grid item xs={12} style={{maxHeight: 400, borderTop: 'solid 0.5px'}}>
    <select onChange={(e) => this.setState({mode: e.target.value})}>
      {
        [ {value: 'boiler', name: 'Boiler and Turbine'},
          {value: 'milling', name: 'Milling house'},
          {value: 'evap', name: 'Evaporation and crystallization'},
        ].map(
          (item, index) => <option key={index} value={item.value}>{item.name}</option>)
      }
    </select>
  </Grid>
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
 */

export default withStyles(styles)(Graph);
