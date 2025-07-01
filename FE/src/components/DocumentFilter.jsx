/* eslint-disable no-unused-vars */
import { useState } from "react";
import { AlertMessage } from "../shared/Alert";

export function DocumentFilter({ onFilter }) {
  const [perPage, setPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [category, setCategory] = useState("all");
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const applyFilter = () => {
    onFilter?.({ perPage, startDate, endDate, selectedDate, category });
    setAlert({
      show: true,
      type: "success",
      message: "Filter applied successfully",
    });
  };

  const resetFilter = () => {
    setPerPage(10);
    setStartDate("");
    setEndDate("");
    setSelectedDate("");
    setCategory("all");
    onFilter?.({
      perPage: 10,
      startDate: "",
      endDate: "",
      selectedDate: "",
      category: "all",
    });

    setAlert({
      show: true,
      type: "success",
      message: "Filter reset successfully",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 border mt-5 rounded-xl p-4 shadow-md">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        🔎 Filter Dokumen
      </h1>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {/* Dropdown Jumlah Dokumen */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
            Tampilkan
          </label>
          <select
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} Dokumen
              </option>
            ))}
          </select>
        </div>

        {/* Filter Rentang Tanggal */}
        {/* <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
            Dari Tanggal
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
            Sampai Tanggal
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div> */}

        {/* Filter Satu Tanggal */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
            Search By Date:
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Kategori Dokumen */}
        {/* <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 block">
            Kategori
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Semua</option>
            <option value="pdf">PDF</option>
            <option value="word">Word</option>
            <option value="image">Gambar</option>
          </select>
        </div> */}
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-end mt-4 gap-3">
        <button
          onClick={resetFilter}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg dark:bg-gray-700 dark:text-white"
        >
          Reset
        </button>
        <button
          onClick={applyFilter}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
        >
          Terapkan Filter
        </button>
      </div>

      {/* Alert Message */}
      {alert.show && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: "", message: "" })}
        />
      )}
    </div>
  );
}
