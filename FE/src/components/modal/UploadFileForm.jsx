import { useState } from "react";

export function UploadFileForm({ onSubmit }) {
  const [type, setType] = useState("payable");
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ type, ...form });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Jenis Dokumen
        </label>
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="payable">Account Payable</option>
          <option value="receivable">Account Receivable</option>
        </select>
      </div>

      {/* Common */}
      <input
        type="text"
        name="noBox"
        placeholder="No Box"
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
      />

      {type === "payable" && (
        <>
          <input
            type="text"
            name="bankName"
            placeholder="Bank Name"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            name="checkNumber"
            placeholder="Check Number"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            type="datetime-local"
            name="transactionDate"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            name="value"
            placeholder="Value"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
        </>
      )}

      {type === "receivable" && (
        <>
          <input
            type="text"
            name="noReceipt"
            placeholder="No Receipt"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            type="datetime-local"
            name="receiptDate"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            name="nominal"
            placeholder="Nominal"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
        </>
      )}

      {/* File */}
      <input
        type="file"
        name="filename"
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
      />

      <div className="text-end">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80"
        >
          Upload
        </button>
      </div>
    </form>
  );
}
