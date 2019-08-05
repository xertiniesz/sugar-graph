import React from 'react';
import Button from '@material-ui/core/Button';
import DataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
// const DataStore = require('nedb-promises');

const header = ['', 'วันที่', 'ปริมาณอ้อย (ตัน)', 'Baggases', '%Pol Baggases', 'Filtercake',	'%Pol Baggases', 'Molasses', '%Pol Molasses',
  'น้ำตาลทรายดิบ (ตัน)',	'น้ำตาลทรายขาว (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์ (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์พิเศษ (ตัน)',
  'น้ำตาลรวม (ตัน)', 'พลังงานไฟฟ้าในกระบวนการผลิต (kWh)', 'ปริมาณไอน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปี (kJ/kg)', 'พลังงานความร้อนที่ใช้ (kWh)',
  'ปริมาณไอน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปี (kJ/kg)', 'พลังงานความร้อนจากไอน้ำ (kWh)', 'ปริมาณไอน้ำ (ตัน/ชั่วโมง)',' เอนทาลปี (kJ/kg)',
  'พลังงานความร้อนที่ใช้ (kWh)', 'ปริมาณไอน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปี (kJ/kg)', 'พลังงานความร้อนที่ใช้ (kWh)', 'พลังงานความร้อนรวม (kWh)'];

const dataTable = [];
// const db = DataStore.create({
//   filename: `./electron.db`,
//   timestampData: true,
//   autoload: true
// });

class Table extends React.Component {
  constructor(props) {
    super(props)
    const tableData = []
    const headerObject = header.map(head => {return {value: head, readOnly: true}})
    tableData.push(headerObject)

    const data = [[{value: '11/02/62'},{value: 11788},{value: 3510},{value: 2.26},{value: 411.33},{value: 4.88},{value: 450.00},{value: 27.13},{value: 635},{value: 444},{value: 434},{value: 0},{value: 1513},{value: 270580},{value: 2318},{value: 3210},{value: 2067240},{value: 6032},{value: 3210},{value: 5378533},{value: 3149},{value: 3210},{value: 2807680},{value: 3149},{value: 2806},{value: 2454315},{value: 5025168}],
      [{value: '12/02/62'},{value: 11839},{value: 3456},{value: 2.17},{value: 443.79},{value: 5.00},{value: 577.21},{value: 27.05},{value: 1084},{value: 102},{value: 4},{value: 0},{value: 1190},{value: 250920},{value: 2081},{value: 3210},{value: 1855380},{value: 5746},{value: 3210},{value: 5123517},{value: 2743},{value: 3210},{value: 2446020},{value: 2743},{value: 2806},{value: 2138172},{value: 4815669}],
      [{value: '14/02/62'},{value: 13851},{value: 4203},{value: 2.29},{value: 494.60},{value: 5.16},{value: 647.18},{value: 26.58},{value: 468},{value: 646},{value: 260},{value: 0},{value: 1374},{value: 286440},{value: 2364},{value: 3210},{value: 2107900},{value: 6795},{value: 3210},{value: 6058875},{value: 3305},{value: 3210},{value: 2946780},{value: 3305},{value: 2806},{value: 2575908},{value: 5688003}],]

    data.forEach(
      (row, index) => {tableData.push([{value: index + 1, readOnly: true}, ...row])}
    )

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
      dataTable: tableData
    }
  }

  // async componentDidMount() {
  //   const data = await db.find({target: 1})
  //   const dataTable = this.state.dataTable
  //   data[0].data.forEach(
  //       (row, index) => {dataTable.push([{value: index + 1, readOnly: true}, ...row])}
  //   )
  //
  //   console.log(data)
  //   const row = this.state.dataTable[dataTable.length - 1]
  //   const isLastRowEmpty = row.slice(1).reduce((result, cell) => { return result && (cell.value === '')}, true)
  //   if (!isLastRowEmpty) {
  //     const emptyRow = header.map(() => {return {value: ""}})
  //     dataTable.push([{value: dataTable.length, readOnly: true}, ...emptyRow])
  //     this.setState({ dataTable: dataTable})
  //   }
  //   else{
  //     this.setState({dataTable})
  //   }
  // }

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
    // await db.update({target: 1}, {target: 1,data: dataToStore}, {upsert: true})
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
