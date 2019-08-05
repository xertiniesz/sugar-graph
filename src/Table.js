import React from 'react';
import Button from '@material-ui/core/Button';
import DataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
const DataStore = require('nedb-promises');

const header = ['', 'วันที่', 'ปริมาณอ้อย (ตัน)', 'Baggases', '%Pol Baggases', 'Filtercake',	'%Pol Baggases', 'Molasses', '%Pol Molasses',
  'น้ำตาลทรายดิบ (ตัน)',	'น้ำตาลทรายขาว (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์ (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์พิเศษ (ตัน)',
  'น้ำตาลรวม (ตัน)', 'พลังงานไฟฟ้าในกระบวนการผลิต (kWh)', 'ปริมาณไอน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปี (kJ/kg)', 'พลังงานความร้อนที่ใช้ (kWh)',
  'ปริมาณไอน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปี (kJ/kg)', 'พลังงานความร้อนจากไอน้ำ (kWh)', 'ปริมาณไอน้ำ (ตัน/ชั่วโมง)',' เอนทาลปี (kJ/kg)',
  'พลังงานความร้อนที่ใช้ (kWh)', 'ปริมาณไอน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปี (kJ/kg)', 'พลังงานความร้อนที่ใช้ (kWh)', 'พลังงานความร้อนรวม (kWh)'];

const dataTable = [];
const db = DataStore.create({
  filename: `./electron.db`,
  timestampData: true,
  autoload: true
});

class Table extends React.Component {
  constructor(props) {
    super(props)
    const data = []
    const headerObject = header.map(head => {return {value: head, readOnly: true}})
    data.push(headerObject)

    // Object.keys(localStorage).forEach(key => {
    //   if (key.match(/row\[\d+\/\d+\/\d+\]/)) {
    //     const row = localStorage.getItem(key)
    //     const rowData = row.split(',').map(
    //       (ele, index) => {
    //         return {value: ele}
    //       })
    //     data.push([{value: 0, readOnly: true}, ...rowData])
    //   }
    // })
    // if (localStorage.getItem('tableData')) {
    //   JSON.parse(localStorage.getItem('tableData'))
    //     .forEach((row, index) => {
    //       data.push([{value: index + 1, readOnly: true}, ...row])
    //   })
    // }

    this.state = {
      dataTable: data
    }
  }

  async componentDidMount() {
    const data = await db.find({target: 1})
    const dataTable = this.state.dataTable
    data[0].data.forEach(
        (row, index) => {dataTable.push([{value: index + 1, readOnly: true}, ...row])}
    )

    console.log(data)
    const row = this.state.dataTable[dataTable.length - 1]
    const isLastRowEmpty = row.slice(1).reduce((result, cell) => { return result && (cell.value === '')}, true)
    if (!isLastRowEmpty) {
      const emptyRow = header.map(() => {return {value: ""}})
      dataTable.push([{value: dataTable.length, readOnly: true}, ...emptyRow])
      this.setState({ dataTable: dataTable})
    }
    else{
      this.setState({dataTable})
    }
  }

  addEmptyRow() {
    const dataTable = this.state.dataTable
    const row = this.state.dataTable[dataTable.length - 1]
    const isLastRowEmpty = row.slice(1).reduce((result, cell) => { return result && (cell.value === '')}, true)
    console.log(isLastRowEmpty)
    if (!isLastRowEmpty) {
      const emptyRow = header.map(() => {return {value: ""}})
      dataTable.push([{value: dataTable.length, readOnly: true}, ...emptyRow])
      this.setState({ dataTable: dataTable})
    }
  }

  async updateStorage(dataTable) {
    const dataToStore = dataTable.slice(1).map(row => {return row.slice(1)})
    console.log(dataToStore)
    await db.update({target: 1}, {target: 1,data: dataToStore}, {upsert: true})
  }

  render() {
    return(
      <div className="content">
        <div className="bar">
          <Button style={{marginTop: 5, marginBottom: 5}}variant="contained" color="primary" onClick={() => console.log("test")}>Export</Button>
        </div>
        <div className="body spread-sheet">
          <DataSheet
            data={this.state.dataTable}
            overflow="clip"
            valueRenderer={(cell) => cell.value}
            onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
            onCellsChanged={changes => {
              const dataTable = this.state.dataTable.map(row => [...row])
              changes.forEach(({row, col, value}) => {
                dataTable[row][col] = {...dataTable[row][col], value: value.trim().replace(/,/gi, '')}
              })

              this.updateStorage(dataTable)
              this.setState({dataTable}, this.addEmptyRow)
            }}
          />
        </div>
      </div>
    );
  }
}

export default Table
