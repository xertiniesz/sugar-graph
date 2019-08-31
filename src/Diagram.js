import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from './Table';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import KMITL from './kmitl_logo.png';
import OCSB from './LOGO_OCSB.jpg';
import LinearProgress from '@material-ui/core/LinearProgress';
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
  },
  image: {
    marginLeft: theme.spacing(10),
    marginRight: theme.spacing(10),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  }
});

class Diagram extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tableData: [],
      date: ''
    }
  }

  componentWillMount() {
    this.props.db.find({target: 1})
      .then( data => {
        const tableData = this.state.tableData
        if (data[0]) {
          data[0].data.forEach(
            (row, index) => {tableData.push([{value: index + 1, readOnly: true}, ...row])}
          )
        }

        const date = tableData[0] ? tableData[0][1].value : ''
        this.setState({tableData, date}, () => this.redraw(date))
      })
  }

  componentDidMount() {
    if (this.state.tableData[0]) {
      this.redraw(this.state.tableData[0][1].value)
    }
  }

  redraw(date) {
    const canvas = document.getElementById('diagram-canvas')
    const ctx = canvas.getContext('2d')

    canvas.setAttribute('width', window.innerWidth * 0.8);
    canvas.setAttribute('height', window.innerHeight * 0.8);

    const DOMURL = window.URL || window.webkitURL || window;
    const img = new Image();
    const svg = new Blob([TestDiagram(date, this.state.tableData)], {
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
        <Grid className={classes.paper} container spacing={2}
              direction="column"
              alignItems="center"
              justify="center" style={{ margin: 0, width: '100%', }}>
          <Grid item xs={12} style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography variant="h4">Diagram</Typography>
          </Grid>
          <Grid item xs={12} style={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
            <img className={classes.image} height="200px" src={OCSB}/>
            <img className={classes.image} height="200px" src={KMITL}/>
          </Grid>
          <Grid item xs={12} style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography variant="h4">โปรแกรมการประเมินประสิทธิภาพการใช้พลังงานในกระบวนการผลิตน้ำตาลทราย</Typography>
          </Grid>
          <Grid item xs={12} style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <br/>
            <div>
              วันที่:
              <select style={{width: '15%', height: '3em', marginTop: 5}} onChange={(e) => {this.redraw(e.target.value); this.setState({date: e.target.value})}}>
                {this.state.tableData.map(row => <option value={row[1].value}>{row[1].value}</option>)}
              </select>
            </div>
            <canvas id="diagram-canvas">
            </canvas>
          </Grid>
          <Table db={this.props.db}/>
        </Grid>
      </div>
    )
  }
}

Diagram.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Diagram);
