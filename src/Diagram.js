import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from './Table';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TestDiagram from './testDiagram';
const DataStore = require('nedb-promises');

const db = DataStore.create({
  filename: `./electron.db`,
  timestampData: true,
  autoload: true
});

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

    this.state = {
      tableData: [],
      date: undefined
    }
  }

  componentWillMount() {
    db.find({target: 1})
      .then( data => {
        const tableData = this.state.tableData
        data[0].data.forEach(
          (row, index) => {tableData.push([{value: index + 1, readOnly: true}, ...row])}
        )

        console.log('set')
        this.setState({tableData, date: tableData[0][1].value})
      })
  }

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
