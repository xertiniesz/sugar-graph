import React from 'react';
import Button from '@material-ui/core/Button';
import DataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';

const header = ['', 'วันที่', 'ปริมาณอ้อย (ตัน)', 'Baggases', '%Pol Baggases', 'Filtercake','%Pol Baggases', 'Molasses', '%Pol Molasses',
  'น้ำตาลทรายดิบ (ตัน)','น้ำตาลทรายขาว (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์ (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์พิเศษ (ตัน)',
  'น้ำตาลรวม (ตัน)', 'พลังงานไฟฟ้าในกระบวนการผลิต (kWh)', 'ปริมาณไอน้ำในกระบวนการหีบอ้อย (ตัน/ชั่วโมง)', 'เอนทาลปีในกระบวนการหีบอ้อย (kJ/kg)', 'พลังงานความร้อนที่ใช้ในกระบวนการหีบอ้อย (kWh)',
  'ปริมาณไอน้ำหม้อต้มน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปีหม้อต้มน้ำ (kJ/kg)', 'พลังงานความร้อนจากไอน้ำหม้อต้มน้ำ (kWh)', 'ปริมาณไอน้ำขาเข้ากังหันไอน้ำ (ตัน/ชั่วโมง)',' เอนทาลปีขาเข้ากังหันไอน้ำ (kJ/kg)',
  'พลังงานความร้อนที่ใช้ขาเข้ากังหันไอน้ำ (kWh)', 'ปริมาณไอน้ำขาออกกังหันไอน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปีขาออกกังหันไอน้ำ (kJ/kg)', 'พลังงานความร้อนที่ใช้ขาออกกังหันไอน้ำ (kWh)', 'พลังงานความร้อนรวม (kWh)'];

class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: []
    }
  }

  componentDidMount() {
    const tableData = []
    console.log(`compact `, __dirname)
    this.props.db.find({target: 1})
      .then( data => {
        tableData.push(header.map(head => {return {value: head, readOnly: true}}))
        // const tableData = [header.map(head => {return {value: head, readOnly: true}}), ...this.state.tableData]
        if (data[0]) {
          data[0].data.forEach(
            (row, index) => {tableData.push([{value: index + 1, readOnly: true}, ...row])}
          )
        }

        console.log(` > tableData\n`, tableData)
        const row = tableData[tableData.length - 1]
        const isLastRowEmpty = row.slice(1).reduce((result, cell) => { return result && (cell.value === '')}, true)
        if (!isLastRowEmpty) {
          const emptyRow = header.map(() => {return {value: ""}})
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
      header.map(head => {return {value: head, readOnly: true}}),
      ...data.map((row, index) => {return [{value: index + 1, readOnly: true}, ...row]})
    ]
    const row = data[data.length - 1] ? data[data.length - 1] : []
    const isLastRowEmpty =  !row.length ? false : row.reduce((result, cell) => { return result && (cell.value === '')}, true)
    if (!isLastRowEmpty) {
      const emptyRow = [{value: tableData.length, readOnly: true}, ...header.slice(1).map(() => {return {value: ""}})]
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
    const dataTable = this.state.dataTable
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
    const value = cell.value
    if (Number.isFinite(value)) {
      return value.toLocaleString()
    }
    else {
      return value
    }
    // return value
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
            onCellsChanged={changes => {
              const tableData = this.state.tableData.map(row => [...row])
              changes.forEach(({row, col, value}) => {
                tableData[row][col] = {...tableData[row][col], value: value.trim().replace(/,/gi, '')}
              })

              this.updateStorage(tableData)
              // this.setState({tableData}, this.addEmptyRow)
            }}
          />
        </div>
      </div>
    );
  }
}

export default Table
