import React from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Spreadsheet from "react-spreadsheet";

export default function Table() {
  const header = ['วันที่', 'ปริมาณอ้อย (ตัน)',	'น้ำตาลทรายดิบ (ตัน)',	'น้ำตาลทรายขาว (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์ (ตัน)', 'น้ำตาลทรายขาวบริสุทธิ์พิเศษ (ตัน)',
                  'น้ำตาลรวม (ตัน)', 'พลังงานไฟฟ้าในกระบวนการผลิต (kWh)', 'ปริมาณไอน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปี (kJ/kg)', 'พลังงานความร้อนที่ใช้ (kWh)',
                  'ปริมาณไอน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปี (kJ/kg)', 'พลังงานความร้อนจากไอน้ำ (kWh)', 'ปริมาณไอน้ำ (ตัน/ชั่วโมง)',' เอนทาลปี (kJ/kg)',
                  'พลังงานความร้อนที่ใช้ (kWh)', 'ปริมาณไอน้ำ (ตัน/ชั่วโมง)', 'เอนทาลปี (kJ/kg)', 'พลังงานความร้อนที่ใช้ (kWh)'];
  const data = [];
  const headerObject = header.map(head => {return {value: head}})
  data.push(headerObject)

  return(
    <div className="content">
      <div className="bar">
        <Button variant="contained" color="primary">Export</Button>
      </div>
      <div className="body spread-sheet">
        <Spreadsheet data={data} onClick={(e) => console.log(e)}/>
      </div>
    </div>
  );
}
