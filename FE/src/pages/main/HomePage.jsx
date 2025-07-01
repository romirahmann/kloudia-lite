/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Toolbar } from "../../components/Toolbar";
import { Modal } from "../../shared/Modal";
import { TablePayable } from "../../components/TablePayable";
import { TableReceivable } from "../../components/TableReceivable";
import { UploadFileForm } from "../../components/modal/UploadFileForm";
import { UploadFolderForm } from "../../components/modal/UploadFolderForm";
import { EditForm } from "../../components/modal/EditForm";
import { DeleteConfirmation } from "../../components/modal/DeleteConfirmation";
import api from "../../services/axios.service";
import { SkeletonPage } from "../../shared/Skeleton";
import { AnimatePresence, motion } from "motion/react";
import { AlertMessage } from "../../shared/Alert";

export function HomePage() {
  const [menuIsActive, setMenuIsActive] = useState("payable");
  const [modalOpen, setModalOpen] = useState({
    showUploadFile: false,
    showUploadFolder: false,
    showEdit: false,
    showDelete: false,
  });
  const [documents, setDocuments] = useState({});
  const [filter, setFilter] = useState({});
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    fetchDocument();
  }, [menuIsActive]);

  // FETCH DATA
  const fetchDocument = async () => {
    setLoading(true);
    switch (menuIsActive) {
      case "payable":
        try {
          let res = await api.get(`/master/files-payable`);

          setDocuments(res.data.data);
        } catch (error) {
          console.log(error.response);
        }
        break;
      case "receivable":
        try {
          let res = await api.get(`/master/files-receivable`);

          setDocuments(res.data.data);
        } catch (error) {
          console.log(error.response);
        }
        break;
    }
    setLoading(false);
  };

  // SEARCH & FILTER
  const handleChangeMenu = (type) => {
    setMenuIsActive(type);
  };

  const handleOnSearch = async (query) => {
    setFilter({ ...filter, querySearch: query });
    if (menuIsActive === "payable") {
      let res = await api.get(`/master/files-payable?q=${query}`);
      setDocuments(res.data.data);
      return;
    }
    if (menuIsActive === "receivable") {
      let res = await api.get(`/master/files-receivable?q=${query}`);
      setDocuments(res.data.data);
      return;
    }
  };

  const handleOnFilter = async (filter) => {
    setFilter(filter);
    if (menuIsActive === "payable") {
      let res = await api.get(
        `/master/files-payable?filterDate=${filter.selectedDate}`
      );
      setDocuments(res.data.data);
      return;
    }
    if (menuIsActive === "receivable") {
      let res = await api.get(
        `/master/files-receivable?filterDate=${filter.selectedDate}`
      );
      setDocuments(res.data.data);
      return;
    }
  };

  const handleOpenModal = (type) => {
    switch (type) {
      case "VIEW":
        if (selectedDoc) {
          getFilePDF(selectedDoc.filePath);
          break;
        }
        setAlert({
          show: true,
          message: "Please select a document to proceed",
          type: "warning",
        });
        break;
      case "FILE":
        setModalOpen({ showUploadFile: true });
        break;
      case "FOLDER":
        setModalOpen({ showUploadFolder: true });
        break;
      case "EDIT":
        if (selectedDoc) {
          setModalOpen({ showEdit: true });
          break;
        }

        setAlert({
          show: true,
          message: "Please select a document to proceed",
          type: "warning",
        });
        break;
      case "DELETE":
        if (selectedDoc) {
          setModalOpen({ showDelete: true });
          break;
        }

        setAlert({
          show: true,
          message: "Please select a document to proceed",
          type: "warning",
        });
        break;
      default:
        break;
    }
  };

  const getFilePDF = async (filePath) => {
    try {
      let res = await api.get(`/master/file-url?filePath=${filePath}`);
      let data = res.data.data;
      window.open(data, "_blank");
    } catch (error) {
      console.log(error.response);
    }
  };

  // Handle Deleted
  const handleDeleted = () => {
    console.log(selectedDoc);
  };

  // Handle Upload Folder
  const handleUploadFolder = async (selectedFolder) => {
    if (!selectedFolder || selectedFolder.length === 0) {
      setAlert({
        show: true,
        message: "Please select  folder to proceed",
        type: "warning",
      });
      return;
    }

    const formData = new FormData();
    const paths = [];

    for (let file of selectedFolder) {
      const relativePath = file.webkitRelativePath;
      if (!relativePath) {
        setAlert({
          show: true,
          message: "Path InValid!",
          type: "error",
        });
        return;
      }
      formData.append("files", file);
      paths.push(relativePath);
    }

    formData.append("paths", JSON.stringify(paths));

    try {
      await api.post(`/upload-folder`, formData);
      setModalOpen({ ...modalOpen, uploadFolder: false });
      setAlert({
        show: true,
        message: "Folder uploaded successfully",
        type: "success",
      });
    } catch (error) {
      setAlert({
        show: true,
        message: "Folder uploaded failed",
        type: "error",
      });
      console.log(error.response);
    }
  };

  // Handle Upload File

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <>
      <div className="max-w-full">
        <Toolbar
          openModal={handleOpenModal}
          onFilter={handleOnFilter}
          querySearch={handleOnSearch}
        />

        <div className="mainContent mt-5">
          <div className="topMenu flex">
            <button
              onClick={() => handleChangeMenu("payable")}
              className={`p-3 rounded-t-xl ${
                menuIsActive === "payable"
                  ? "bg-white dark:bg-gray-900 dark:text-gray-200 text-black border-b-0"
                  : "bg-gray-100 dark:bg-gray-950 text-gray-600"
              } border dark:border-gray-900 border-gray-300`}
            >
              Document Payable
            </button>
            <button
              onClick={() => handleChangeMenu("receivable")}
              className={`p-3 rounded-t-xl ${
                menuIsActive === "receivable"
                  ? "bg-white dark:bg-gray-900 dark:text-gray-200 text-black border-b-0"
                  : "bg-gray-100 dark:bg-gray-950 text-gray-600"
              } border dark:border-gray-900 border-gray-300`}
            >
              Document Receivable
            </button>
          </div>

          <div className="mainContent dark:bg-gray-900 bg-white rounded-b-lg p-5">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <SkeletonPage />
                </motion.div>
              ) : menuIsActive === "payable" ? (
                <motion.div
                  key="payable"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <TablePayable
                    data={documents}
                    selectedData={setSelectedDoc}
                    filter={filter}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="receivable"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <TableReceivable
                    data={documents}
                    selectedData={setSelectedDoc}
                    filter={filter}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MODALS */}
        <Modal
          isOpen={modalOpen.showUploadFile}
          title="Upload File"
          onClose={() => setModalOpen({ showUploadFile: false })}
        >
          <UploadFileForm
            onSubmit={(data) => console.log("Uploaded File:", data)}
          />
        </Modal>

        <Modal
          isOpen={modalOpen.showUploadFolder}
          title="Upload Folder"
          onClose={() => setModalOpen({ showUploadFolder: false })}
        >
          <UploadFolderForm onUpload={(files) => handleUploadFolder(files)} />
        </Modal>

        <Modal
          isOpen={modalOpen.showEdit}
          title="Edit Dokumen"
          onClose={() => setModalOpen({ showEdit: false })}
        >
          <EditForm
            defaultData={selectedDoc}
            onSave={(data) => console.log("Updated Doc:", data)}
            typeDocument={menuIsActive}
          />
        </Modal>

        <Modal
          isOpen={modalOpen.showDelete}
          title="Delete Dokumen"
          onClose={() => setModalOpen({ showDelete: false })}
        >
          <DeleteConfirmation onDelete={() => handleDeleted()} />
        </Modal>

        {/* ALERTS */}
        {alert.show && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, type: "", message: "" })}
          />
        )}
      </div>
    </>
  );
}
