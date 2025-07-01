/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";

export function EditForm({
  defaultData = {},
  onSave,
  typeDocument = "payable",
}) {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(defaultData);
    console.log(defaultData);
  }, [defaultData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk format label (misal: "first_name" => "First Name")
  const formatLabel = (key) => {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")

      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.keys(form).map((key) => {
        if (
          [
            "id",
            "filePath",
            "document_id",
            "documentName",
            "filename",
          ].includes(key)
        )
          return null;

        return (
          <div key={key} className="flex flex-col space-y-1">
            <label
              htmlFor={key}
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {formatLabel(key)}
            </label>
            <input
              id={key}
              name={key}
              type="text"
              placeholder={formatLabel(key)}
              value={form[key] || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        );
      })}

      <div className="text-end">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Simpan
        </button>
      </div>
    </form>
  );
}
