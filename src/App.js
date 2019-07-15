import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Diagram from './Diagram.js';
import Table from './Table.js';
import './App.css';

export default class App extends React.Component {
  state = {
    content: 'diagram',
  }
  render() {
    return(
      <div className="warpper">
        <div className="side-bar">
          <h3 style={{backgroundColor: '#222327', height: '2em', padding: '.5em', margin: 0}}>MENU</h3>
          <MenuList>
            <MenuItem onClick={()=>this.setState({content: 'diagram'})}>
              Diagram
            </MenuItem>
            <MenuItem onClick={()=>this.setState({content: 'table'})}>
              Table
            </MenuItem>
          </MenuList>
        </div>
        {
          this.state.content === 'diagram' ? <Diagram /> : <Table />
        }
      </div>
    )
  }
}
