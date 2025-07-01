var express = require("express");
var router = express.Router();
const path = require("path");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");
const uploadFolders = multer({ storage: storage }).array("files");
const { verifyToken, accessControl } = require("../services/auth.service");

const authRoutes = require("../routes/utility_routes/auth.routes");
const masterRoutes = require("../routes/master_routes/master.routes");
const MinioController = require("../controllers/master_controllers/MinioController");

router.use("/auth/", authRoutes);
router.use("/master/", verifyToken, accessControl, masterRoutes);
router.use("/upload-file/", upload, MinioController.uploadFile);
router.use("/upload-folder/", uploadFolders, MinioController.uploadFolder);

module.exports = router;
