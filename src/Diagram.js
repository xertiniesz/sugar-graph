import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from './Table';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TestDiagram from './testDiagram';

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
      tableData: JSON.parse(localStorage.getItem('tableData')) || []
    }
  }

  tableGenerator(tableData) {
    console.log(tableData)
    const table = `
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">
          <style>
            table {
              width: 350px;
              border: solid 0.5px;
              border-collapse: collapse;
              background-color: white;
            }
            td {
              padding: 5px 10px 5px 10px;
              border: solid 0.5px;
            }
            th {
              padding: 5px 10px 5px 10px;
              border: solid 0.5px;
            }
          </style>
          <foreignObject width='100%' height='100%'>
            <body xmlns="http://www.w3.org/1999/xhtml">
              <table>
                <tbody>
                  ${
                    tableData.reduce((tableRow, row) => 
                    {return tableRow + `<tr><th>${row.header}</th><td>${row.data}</td><th>${row.unit}</th></tr>`}, '')
                  }
                </tbody>
              </table>
            </body>
          </foreignObject>
        </svg>`;

    return table
  }

  componentDidMount() {
    const canvas = document.getElementById('diagram-canvas')
    const body = document.getElementById('diagram-body')
    const ctx = canvas.getContext('2d')
    const dpi = window.devicePixelRatio;

    canvas.setAttribute('width', window.innerWidth * dpi * 0.8);
    canvas.setAttribute('height', window.innerHeight * dpi * 0.8);
    console.log(` > window.innerWidth\n`, window.innerWidth * dpi * 0.8)
    console.log(` > window.innerHeight\n`, window.innerHeight * dpi * 0.8)

    const DOMURL = window.URL || window.webkitURL || window;
    const img = new Image();
    const svg = new Blob([TestDiagram('06/01/62')], {
      type: "image/svg+xml;charset=utf-8"
    });
    const url = DOMURL.createObjectURL(svg);

    img.onload = () => {
      // get the scale
      console.log(` > canvas.width\n`, canvas.width)
      console.log(` > canvas.height\n`, canvas.height)
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
    const options = this.state.tableData.reduce((acc, row) => {return acc + `<option value={'${row[0].value}'}>${row[0].value}</option>`}, '')


    return(
      <div id="diagram-body" className="body">
        {console.log(` > options\n`, this.state.tableData.reduce((options, row) => {return options + `<option value={'${row[0].value}'}>${row[0].value}</option>`}, ''))}
        <Grid className={classes.paper} container spacing={2} style={{ margin: 0, width: '100%', }}>
          <Grid item xs={12} style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography variant="h4">Diagram</Typography>
            <br/>
            <div>
              วันที่:
              <select style={{width: '15%', height: '3em', marginTop: 5}} onChange={(e) => console.log(e.target.value)}>
                {this.state.tableData.map(row => <option value={row[0].value}>{row[0].value}</option>)}
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
