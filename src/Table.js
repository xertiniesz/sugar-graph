import React from 'react';
import Button from '@material-ui/core/Button';
import DataSheet from 'react-datasheet';
import config from './config'
import 'react-datasheet/lib/react-datasheet.css';

const headers = config.HEADERS

class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: []
    }

    this.onCellChanged = this.onCellChanged.bind(this)
  }

  componentDidMount() {
    const tableData = []
    this.props.db.find({target: 1})
      .then( data => {
        tableData.push(headers.map(head => {return {value: head, readOnly: true}}))
        if (data[0]) {
          data[0].data.forEach(
            (row, index) => {tableData.push([{value: index + 1, readOnly: true}, ...row])}
          )
        }

        const row = tableData[tableData.length - 1]
        const isLastRowEmpty = row.slice(1).reduce((result, cell) => { return result && (cell.value === '')}, true)
        if (!isLastRowEmpty) {
          const emptyRow = headers.slice(1).map(() => {return {value: ""}})
          tableData.push([{value: tableData.length, readOnly: true}, ...emptyRow])
          this.setState({ tableData })
        }
        else{
          this.setState({tableData})
        }
      }
    )
  }

  forceReloadIfEmpty(previousData) {
    if (previousData) {
      const isLastRowEmpty = previousData.slice(1).reduce((result, cell) => { return result && (cell.value === '')}, true)
      if (isLastRowEmpty) {
        window.location.reload(true)
      }
    }
  }

  addEmptyRow(data) {
    const tableData = [
      headers.map(head => {return {value: head, readOnly: true}}),
      ...data.map((row, index) => {return [{value: index + 1, readOnly: true}, ...row]})
    ]
    const row = data[data.length - 1] ? data[data.length - 1] : []
    const isLastRowEmpty =  !row.length ? false : row.reduce((result, cell) => { return result && (cell.value === '')}, true)
    if (!isLastRowEmpty) {
      const emptyRow = [{value: tableData.length, readOnly: true}, ...headers.slice(1).map(() => {return {value: ""}})]
      tableData.push(emptyRow)
    }
    const previousData = this.state.tableData[1]
    this.setState({ tableData: tableData}, () => this.forceReloadIfEmpty(previousData))
  }

  removeEmptyTrail(dataToStore) {
    if (dataToStore.length > 0) {
      const isLastRowEmpty = dataToStore[dataToStore.length - 1].reduce((result, cell) => { return result && (cell.value === '' || cell.readOnly)}, true)
      if (isLastRowEmpty) {
        dataToStore.splice(dataToStore.length - 1, 1)
        this.removeEmptyTrail(dataToStore)
      }
    }
  }

  updateStorage(dataTable) {
    const dataToStore = dataTable.slice(1).map(row => {return row.slice(1)})
    this.removeEmptyTrail(dataToStore)
    this.props.db.update({target: 1}, {target: 1,data: dataToStore}, {upsert: true})
    this.addEmptyRow(dataToStore)
  }

  download() {
    const dataTable = this.state.tableData
    let csvData = dataTable.slice(0, dataTable.length-1).map(row => row.slice(1).map( ele => ele.value).join(','))
    const blob = new Blob([csvData.join('\n')], {type: 'text/csv'})

    const a = document.createElement('a');
    a.download = `sugar_export_${(new Date()).toLocaleDateString()}.csv`;
    a.href = window.URL.createObjectURL(blob);
    a.textContent = 'Download CSV';

    a.dataset.downloadurl = [{type: 'text/csv'}, a.download, a.href].join(':');

    a.click()
  }

  formatNumber(cell) {
    let value = cell.value
    if (Number.isFinite(value)) {
      const localValue = value.toFixed(2).toLocaleString()
      return localValue ? localValue : value
    }
    else {
      return value
    }
  }

  cellRenderer(props) {
    const {
      cell, row, col,
      ...rest } = props
    const attributes = cell.attributes || {}
    attributes.style = {
      minWidth: '75px',
      maxWidth: '100px',
      whiteSpace: 'unset',
    }
    if (row < 1) {
      attributes.style = {
        ...attributes.style,
        paddingRight: '10px',
        paddingLeft: '10px'
      }
    }
    else {
      attributes.style = {
        ...attributes.style,
        paddingLeft: '10px'
      }
    }


    if (col < 1) {
      attributes.style = {
        ...attributes.style,
        textAlign: 'right'
      }
    }
    return (
        <td {...rest} {...attributes}>
          {props.children}
        </td>
    )
  }

  onCellChanged(changes, additions) {
    const tableData = this.state.tableData.map(row => [...row])
    changes.forEach(({row, col, value}) => {
      const modifiedValue = col > 1 ? parseFloat(value.trim().replace(/\D/gi, '')) : value
      tableData[row][col] = {...tableData[row][col], value: modifiedValue}
    })

    const additionRow = []
    let curRow = -1
    let rowTemplate = [{value: tableData.length, readOnly: true}]

    if (additions) {
      additions.forEach(({row, col, value}) => {
        if (curRow > -1 && curRow != row) {
          additionRow[row-1] = rowTemplate
          rowTemplate = [{value: row, readOnly: true}]
        }
        const modifiedValue = col > 1 ? value.trim().replace(/\D/gi, '') : value
        rowTemplate[col] = {value: modifiedValue}
        curRow = row
      })
    }

    const newData = [...tableData, ...additionRow.slice(tableData.length)]
      .map(row => {
        if (row.length < headers.length) {
          const fillerArray = new Array(row.length - headers.length).fill('')
          return [...row, ...fillerArray]
        }

        return row
      })

    this.updateStorage(newData)
  }

  parsePaste(clipboardData) {
    const paste = clipboardData.split(/\r\n|\n|\r/).filter(row => row.length > 0).map(row => row.split("\t"))
    // console.log(paste)
    return paste
  }

  render() {
    return(
      <div className="content">
        <div className="bar">
          <Button style={{marginTop: 5, marginBottom: 5}}variant="contained" color="primary" onClick={() => this.download()}>Export</Button>
        </div>
        <div className="body spread-sheet">
          <DataSheet
            data={this.state.tableData}
            overflow="clip"
            valueRenderer={this.formatNumber}
            cellRenderer={this.cellRenderer}
            onCellsChanged={this.onCellChanged}
            parsePaste={this.parsePaste}
          />
        </div>
      </div>
    );
  }
}

export default Table
