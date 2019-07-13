import React from 'react';
import Spreadsheet from "react-spreadsheet";

export default function Table() {
  const data = [
    [{ value: "Vanilla" }, { value: "Chocolate" }],
    [{ value: "Strawberry" }, { value: "Cookies" }]
  ];

  return(
    <Spreadsheet data={data} />
  );
}
