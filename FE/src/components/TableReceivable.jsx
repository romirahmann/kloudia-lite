import moment from "moment";
import { Table } from "../shared/Table";

/* eslint-disable no-unused-vars */
export function TableReceivable({ data, selectedData, filter }) {
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
    { header: "No Receipt", key: "noReceipt" },
    {
      header: "Receipt Date",
      key: "receiptDate",
      render: (val) => (val ? moment(val).format("DD MMM YYYY") : "-"),
    },
    { header: "Nominal", key: "nominal" },
    { header: "Filename", key: "filename" },
  ];
  return (
    <>
      <Table data={data} columns={columns} rowsPerPage={filter.perPage || 10} />
    </>
  );
}
