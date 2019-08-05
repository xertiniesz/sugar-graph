import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from './Table';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TestDiagram from './testDiagram';
// const DataStore = require('nedb-promises');
//
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

class Diagram extends React.Component {

  constructor(props) {
    super(props)
    let tableData = []
    const data = [[{value: '11/02/62'},{value: 11788},{value: 3510},{value: 2.26},{value: 411.33},{value: 4.88},{value: 450.00},{value: 27.13},{value: 635},{value: 444},{value: 434},{value: 0},{value: 1513},{value: 270580},{value: 2318},{value: 3210},{value: 2067240},{value: 6032},{value: 3210},{value: 5378533},{value: 3149},{value: 3210},{value: 2807680},{value: 3149},{value: 2806},{value: 2454315},{value: 5025168}],
      [{value: '12/02/62'},{value: 11839},{value: 3456},{value: 2.17},{value: 443.79},{value: 5.00},{value: 577.21},{value: 27.05},{value: 1084},{value: 102},{value: 4},{value: 0},{value: 1190},{value: 250920},{value: 2081},{value: 3210},{value: 1855380},{value: 5746},{value: 3210},{value: 5123517},{value: 2743},{value: 3210},{value: 2446020},{value: 2743},{value: 2806},{value: 2138172},{value: 4815669}],
      [{value: '14/02/62'},{value: 13851},{value: 4203},{value: 2.29},{value: 494.60},{value: 5.16},{value: 647.18},{value: 26.58},{value: 468},{value: 646},{value: 260},{value: 0},{value: 1374},{value: 286440},{value: 2364},{value: 3210},{value: 2107900},{value: 6795},{value: 3210},{value: 6058875},{value: 3305},{value: 3210},{value: 2946780},{value: 3305},{value: 2806},{value: 2575908},{value: 5688003}],]

    data.forEach(
      (row, index) => {tableData.push([{value: index + 1, readOnly: true}, ...row])}
    )
    console.log(data[0][0].value)
    this.state = {
      tableData: tableData,
      date: data[0][0].value
    }
  }
  //
  // componentWillMount() {
  //   const data = [[{value: '11/02/62'},{value: 11788},{value: 3510},{value: 2.26},{value: 411.33},{value: 4.88},{value: 450.00},{value: 27.13},{value: 635},{value: 444},{value: 434},{value: 0},{value: 1513},{value: 270580},{value: 2318},{value: 3210},{value: 2067240},{value: 6032},{value: 3210},{value: 5378533},{value: 3149},{value: 3210},{value: 2807680},{value: 3149},{value: 2806},{value: 2454315},{value: 5025168}],
  //   [{value: '12/02/62'},{value: 11839},{value: 3456},{value: 2.17},{value: 443.79},{value: 5.00},{value: 577.21},{value: 27.05},{value: 1084},{value: 102},{value: 4},{value: 0},{value: 1190},{value: 250920},{value: 2081},{value: 3210},{value: 1855380},{value: 5746},{value: 3210},{value: 5123517},{value: 2743},{value: 3210},{value: 2446020},{value: 2743},{value: 2806},{value: 2138172},{value: 4815669}],
  //   [{value: '14/02/62'},{value: 13851},{value: 4203},{value: 2.29},{value: 494.60},{value: 5.16},{value: 647.18},{value: 26.58},{value: 468},{value: 646},{value: 260},{value: 0},{value: 1374},{value: 286440},{value: 2364},{value: 3210},{value: 2107900},{value: 6795},{value: 3210},{value: 6058875},{value: 3305},{value: 3210},{value: 2946780},{value: 3305},{value: 2806},{value: 2575908},{value: 5688003}],]
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

  componentDidMount() {
    const canvas = document.getElementById('diagram-canvas')
    const ctx = canvas.getContext('2d')
    const dpi = window.devicePixelRatio;
    console.log(` > this.state.dataTable\n`, this.state.dataTable)

    canvas.setAttribute('width', window.innerWidth * dpi * 0.8);
    canvas.setAttribute('height', window.innerHeight * dpi * 0.8);

    const DOMURL = window.URL || window.webkitURL || window;
    const img = new Image();
    const svg = new Blob([TestDiagram(this.state.date, this.state.tableData)], {
      type: "image/svg+xml;charset=utf-8"
    });
    const url = DOMURL.createObjectURL(svg);

    img.onload = () => {
      // get the scale
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      // get the top left position of the image
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, Math.round(img.width * scale), Math.round(img.height * scale));
    }

    img.src = url
  }

  redraw() {
    const canvas = document.getElementById('diagram-canvas')
    const ctx = canvas.getContext('2d')
    const dpi = window.devicePixelRatio;
    console.log(`date main: `, this.state.tableData[0])
    console.log(`date main: `, this.state.date)

    console.log(this.state.date)
    canvas.setAttribute('width', window.innerWidth * dpi * 0.8);
    canvas.setAttribute('height', window.innerHeight * dpi * 0.8);

    const DOMURL = window.URL || window.webkitURL || window;
    const img = new Image();
    const svg = new Blob([TestDiagram(this.state.date, this.state.tableData)], {
      type: "image/svg+xml;charset=utf-8"
    });
    const url = DOMURL.createObjectURL(svg);

    img.onload = () => {
      // get the scale
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      // get the top left position of the image
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, Math.round(img.width * scale), Math.round(img.height * scale));
    }

    img.src = url
  }

  render() {
    const { classes } = this.props;

    return(
      <div id="diagram-body" className="body">
        <Grid className={classes.paper} container spacing={2} style={{ margin: 0, width: '100%', }}>
          <Grid item xs={12} style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography variant="h4">Diagram</Typography>
            <br/>
            <div>
              วันที่:
              <select style={{width: '15%', height: '3em', marginTop: 5}} onChange={(e) => this.setState({date: e.target.value}, this.redraw())}>
                {this.state.tableData.map(row => <option value={row[1].value}>{row[1].value}</option>)}
              </select>
            </div>
            <canvas id="diagram-canvas">
            </canvas>
          </Grid>
          <Table />
        </Grid>
      </div>
    )
  }
}

Diagram.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Diagram);
