var express = require("express");
var router = express.Router();

const UserController = require("../../controllers/master_controllers/UserController");
const MinioController = require("../../controllers/master_controllers/MinioController");
const MetaController = require("../../controllers/master_controllers/MetaController");

// USER
router.post("/user", UserController.register);
// File
router.get("/file/:filename", MinioController.checkFileExists);
router.delete("/delete-file", MinioController.deleteFile);
router.get("/file-url", MinioController.getFileUrl);
router.get("/cek-file/:filename", MinioController.checkFileExists);
router.post("/create-bucket", MinioController.createBucket);
// META
router.get("/count-files", MetaController.getCountFile);
router.get("/files-payable", MetaController.getAllPayable);
router.get("/files-receivable", MetaController.getAllReceivable);
router.get("/document-name", MetaController.getAllDocumentName);
router.get("/document-name", MetaController.getAllDocumentName);
router.put(
  "/file-update/:id/document/:documentName",
  MetaController.updateMetaData
);

module.exports = router;
