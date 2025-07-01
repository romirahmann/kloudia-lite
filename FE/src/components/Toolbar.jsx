/* eslint-disable no-unused-vars */
import { FaEdit, FaEye, FaFileUpload, FaUpload } from "react-icons/fa";
import { Search } from "../shared/Search";
import { MdDeleteForever } from "react-icons/md";
import { useEffect, useState } from "react";
import { DocumentFilter } from "./DocumentFilter";

export function Toolbar({ openModal, querySearch, onFilter }) {
  const [openFilter, setOpenFilter] = useState(false);
  const [userLogin, setUserLogin] = useState([]);

  useEffect(() => {
    setUserLogin(JSON.parse(sessionStorage.getItem("user")));
  }, []);

  const toggleFilter = () => {
    setOpenFilter(!openFilter);
  };

  const handleFilter = (filter) => {
    onFilter(filter);
  };
  const handleOnChange = (e) => {
    let query = e.target.value;
    querySearch(query);
  };

  return (
    <>
      <div className="max-w-full bg-white dark:bg-gray-900 px-5 py-3 shadow-md">
        <div className="toolbar space-y-3 md:space-y-0 md:flex justify-between items-center">
          <div className="toolbar flex gap-2">
            {/* VIEW */}
            <div className="toolItem">
              <button
                onClick={() => openModal("VIEW")}
                className="border border-primary hover:bg-primary hover:text-white p-2 text-xl rounded-md text-blue-900 dark:border-secondary dark:text-white"
              >
                <FaEye />
              </button>
            </div>
            {/* UPLOAD FILE */}
            {userLogin.roleId === 3 || userLogin.roleId === 1 ? (
              <div className="toolItem">
                <button
                  onClick={() => openModal("FILE")}
                  className="border hover:bg-primary hover:text-white border-primary p-2 text-xl rounded-md text-green-800 dark:border-secondary dark:text-white"
                >
                  <FaFileUpload />
                </button>
              </div>
            ) : (
              ""
            )}

            {/* UPLOAD FOLDER */}
            {userLogin.roleId === 3 && (
              <div className="toolItem">
                <button
                  onClick={() => openModal("FOLDER")}
                  className="border hover:bg-primary hover:text-white border-primary p-2 text-xl rounded-md text-green-800 dark:border-secondary dark:text-white"
                >
                  <FaUpload />
                </button>
              </div>
            )}
            {/* EDIT */}
            {userLogin.roleId === 3 || userLogin.roleId === 1 ? (
              <div className="toolItem">
                <button
                  onClick={() => openModal("EDIT")}
                  className="border hover:bg-primary hover:text-white border-primary p-2 text-xl rounded-md text-yellow-800 dark:border-secondary dark:text-white"
                >
                  <FaEdit />
                </button>
              </div>
            ) : (
              ""
            )}

            {/* DELETE */}
            {userLogin.roleId === 3 && (
              <div className="toolItem">
                <button
                  onClick={() => openModal("DELETE")}
                  className="border hover:bg-primary hover:text-white border-primary p-2 text-xl rounded-md text-red-600 dark:border-secondary dark:text-white"
                >
                  <MdDeleteForever />
                </button>
              </div>
            )}
          </div>

          {/* Search + Filter */}
          <div className="search space-y-3 md:space-y-0 md:flex items-center gap-2">
            <Search
              onChange={handleOnChange}
              value=""
              className="w-full md:w-[30em] focus:outline-primary border rounded-xl border-primary dark:bg-transparent dark:placeholder:text-gray-100 dark:border-secondary dark:text-white dark:outline-secondary"
            />
            <button
              onClick={toggleFilter}
              className="py-3 px-3 border border-primary dark:border-secondary dark:text-white rounded-lg hover:bg-primary hover:text-white font-medium"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Filter Box */}
        {openFilter && (
          <div className="mt-5">
            <hr />
            <div className="boxFilter mt-2">
              <DocumentFilter onFilter={handleFilter} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
