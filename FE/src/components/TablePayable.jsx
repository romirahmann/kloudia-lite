/* eslint-disable no-unused-vars */
import moment from "moment";
import { Table } from "../shared/Table";
import { useState } from "react";
export function TablePayable({ data = [], selectedData, filter }) {
  const handleSelected = (row, checked) => {
    selectedData(row);
  };
  const columns = [
    {
      header: (
        <input
          type="checkbox"
          onChange={(e) => {
            const checked = e.target.checked;
            // Misal: handle select all logic
            console.log("Select all:", checked);
          }}
        />
      ),
      key: "__checkbox",
      render: (_, row) => (
        <input
          type="checkbox"
          onChange={(e) => {
            const checked = e.target.checked;
            handleSelected(row, checked);
          }}
        />
      ),
    },
    { header: "No Box", key: "nobox" },
    { header: "Bank Name", key: "namaBank" },
    { header: "Check Number", key: "noCek" },
    {
      header: "Transaction Date",
      key: "transaksiDate",
      render: (val) => (val ? moment(val).format("DD MMM YYYY") : "-"),
    },
    { header: "Value", key: "nilai" },
    { header: "Filename", key: "filename" },
  ];
  return (
    <>
      <Table data={data} columns={columns} rowsPerPage={filter.perPage || 10} />
    </>
  );
}
