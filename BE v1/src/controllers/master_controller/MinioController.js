const MinioModel = require("../../models/minio.model");
const api = require("../../tools/common");

const modelMeta = require("../../models/metadata.model");
const { error } = require("console");

const chunkArray = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
};

const createBucket = async (req, res) => {
  const { bucketName } = req.body;
  try {
    await MinioModel.bucketExists(bucketName);
    return api.ok(res, "Bucket Already Exist");
  } catch (e) {
    try {
      let data = await MinioModel.createBucket(bucketName);
      return api.ok(res, data);
    } catch (e) {
      return api.error(res, e, 500);
    }
  }
};
// Mengupload file
const uploadFile = async (req, res) => {
  const file = req.file;
  const formData = req.body;
  try {
    if (!file) {
      return api.error(res, "No file uploaded", 400);
    }

    let minioFilePath = "";
    let data = {};

    if (formData.document_id === "1") {
      let documenName = "ACOUNT PAYABLE";

      minioFilePath =
        documenName +
        "/" +
        formData.nobox +
        "/" +
        formData.namaBank +
        "_" +
        formData.noCek +
        "_" +
        formData.transaksiDate +
        "_" +
        formData.nilai +
        "/" +
        file.originalname;

      data = {
        document_id: 1,
        nobox: formData.nobox,
        namaBank: formData.namaBank,
        noCek: formData.noCek,
        transaksiDate: formData.transaksiDate,
        nilai: formData.nilai,
        filename: file.originalname,
        filePath: minioFilePath,
      };
      await modelMeta.insertPayable(data);
    } else {
      let documenName = "ACOUNT RECEIVABLE";

      minioFilePath =
        documenName +
        "/" +
        formData.nobox +
        "/" +
        formData.noReceipt +
        "_" +
        formData.receiptDate +
        "_" +
        formData.customer +
        "_" +
        formData.nominal +
        "/" +
        file.originalname;

      data = {
        document_id: 2,
        nobox: formData.nobox,
        noReceipt: formData.noReceipt,
        receiptDate: formData.receiptDate,
        customer: formData.customer,
        nominal: formData.nominal,
        filename: file.originalname,
        filePath: minioFilePath,
      };
      await modelMeta.insertReceivable(data);
    }

    let minioFile = {
      fileName: minioFilePath,
      fileBuffer: file.buffer,
    };

    let result = MinioModel.uploadFile(minioFile);
    return api.ok(res, result);
  } catch (err) {
    // console.error("Error uploading file:", err);
    return api.error(res, err, 500);
  }
};

const uploadFolder = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Tidak ada file yang diunggah." });
    }

    const paths = JSON.parse(req.body.paths);
    if (!Array.isArray(paths) || paths.length !== req.files.length) {
      return res.status(400).json({
        error: "Paths tidak valid atau tidak cocok dengan jumlah file.",
      });
    }

    const files = req.files
      .map((file, index) => ({
        buffer: file.buffer,
        originalname: file.originalname,
        relativePath: paths[index] || file.originalname,
      }))
      .filter((file) => file.originalname.toLowerCase() !== "thumbs.db");

    const batchSize = 50; // Maksimum jumlah file yang diproses sekaligus
    const fileBatches = chunkArray(files, batchSize);
    let successCount = 0;
    let failedCount = 0;

    for (const batch of fileBatches) {
      const results = await Promise.allSettled(
        batch.map(async (file) => {
          try {
            if (!file.relativePath) {
              return;
            }

            await insertDatabase(file.relativePath);
            await MinioModel.uploadFilesWithFolders(
              file.relativePath,
              file.buffer
            );
          } catch (error) {
            throw error;
          }
        })
      );

      successCount += results.filter((r) => r.status === "fulfilled").length;
      failedCount += results.filter((r) => r.status === "rejected").length;
    }
    return api.ok(res, {
      message: "UPLOAD COMPLETED",
      total: files.length,
      success: successCount,
      failed: failedCount,
    });
  } catch (error) {
    console.error("❌ Terjadi kesalahan dalam uploadFolder:", error);
    return api.error(res, error, 500);
  }
};

// Mengunduh file dari MinIO
const downloadFile = async (req, res) => {
  const { fileName } = req.params; // Ambil file name dari parameter URL

  if (!fileName) {
    return api.error(res, "File name is required", 400);
  }

  try {
    let data = await MinioModel.downloadFile(fileName);
    return api.ok(res, data);
  } catch (err) {
    console.error("Error downloading file:", err);
    return api.error(res, err, 500);
  }
};

// Menghapus file dari MinIO
const deleteFile = async (req, res) => {
  const { filePath, accountName, dataId } = req.body;

  if (!filePath) {
    return api.error(res, "File path is required", 400);
  }

  try {
    const fileExist = await MinioModel.fileExist(filePath);
    if (fileExist) {
      // DELETE META DATA
      if (accountName === "ACOUNT PAYABLE") {
        modelMeta.delAP(dataId);
      } else {
        modelMeta.delAR(dataId);
      }
      // DELETE FILE DI MINIO
      const data = await MinioModel.deleteFile(filePath);
      return api.ok(res, data);
    } else {
      return api.error(res, "File tidak ditemukan", 404);
    }
  } catch (err) {
    console.error("Error deleting file:", err);
    return api.error(res, err, 500);
  }
};

// Memeriksa apakah file ada di MinIO
const checkFileExists = async (req, res) => {
  const { fileName } = req.params;

  if (!fileName) {
    return api.error(res, "File name is required", 400);
  }

  try {
    const exists = await MinioModel.fileExists(fileName);
    if (exists) {
      return api.ok(res, "File exists");
    } else {
      return api.error(res, "File not found", 404);
    }
  } catch (err) {
    return api.error(res, err, 500);
  }
};

// Mendapatkan URL presigned untuk file
const getFileUrl = async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return api.error(res, "File Path is required", 400);
    }

    const url = await MinioModel.getFileUrl(filePath);
    // console.log(filePath, url);
    return api.ok(res, url);
  } catch (err) {
    return api.error(res, `Failed to generate presigned URL: ${error}`, 500);
  }
};

const insertDatabase = async (filepath) => {
  if (!filepath) {
    return false;
  }

  const parts = filepath.split("/");

  if (parts.length < 4) {
    return false;
  }

  if (parts[0] === "ACOUNT PAYABLE") {
    const document_id = 1;
    const nobox = parts[1];
    const lastPart = parts[2].split("_");
    const filename = parts[3];
    if (lastPart) {
      const namaBank = lastPart[0];
      const noCek = lastPart[1];
      const transaksiDate = lastPart[2];
      const nilai = lastPart[3];
      const filePath = filepath;
      let data = {
        document_id,
        nobox,
        namaBank,
        noCek,
        transaksiDate,
        nilai,
        filename,
        filePath,
      };

      await modelMeta.insertPayable(data);
      // console.log("Data: ", data, " Berhasil diUpload!");
    }
  }
  if (parts[0] === "ACCOUNT RECEIVABLE") {
    const document_id = 2;
    const nobox = parts[1];
    const lastPart = parts[2].split("_");
    const filename = parts[3];
    if (lastPart) {
      const noReceipt = lastPart[0];
      const receiptDate = lastPart[1];
      const customer = lastPart[2];
      const nominal = lastPart[3];
      const filePath = filepath;
      let data = {
        document_id,
        nobox,
        noReceipt,
        receiptDate,
        customer,
        nominal,
        filename,
        filePath,
      };
      // console.log(data);
      let result = await modelMeta.insertReceivable(data);
      if (result) {
        console.log("Data: ", data, " Berhasil diUpload!");
      } else {
        return error;
      }
    }
  }
};

module.exports = {
  uploadFile,
  uploadFolder,
  downloadFile,
  deleteFile,
  checkFileExists,
  getFileUrl,
  createBucket,
};
