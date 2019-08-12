import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Diagram from './Diagram.js';
import Graph from './Graph.js';
import FreeGraph from './freeGraph';
import './App.css';
const DataStore = require('nedb-promises');

const db = DataStore.create({
  filename: `./electron.db`,
  timestampData: true,
  autoload: true
});

export default class App extends React.Component {
  state = {
    content: 'diagram',
  }

  render() {
    console.log(<Diagram/>)
    return(
      <div className="warpper">
        <div className="side-bar">
          <h3 style={{backgroundColor: '#222327', height: '2em', padding: '.5em', margin: 0}}>MENU</h3>
          <MenuList>
            <MenuItem onClick={()=>this.setState({content: 'diagram'})}>
              Diagram
            </MenuItem>
            <MenuItem onClick={()=>this.setState({content: 'graph'})}>
              Graph
            </MenuItem>
            <MenuItem onClick={()=>this.setState({content: 'free-graph'})}>
              Free Graph
            </MenuItem>
          </MenuList>
        </div>
        {
          this.state.content === 'diagram' ? <Diagram db={db}/> : this.state.content === 'graph' ? <Graph db={db}/> : <FreeGraph db={db}/>
        }
      </div>
    )
  }
}
