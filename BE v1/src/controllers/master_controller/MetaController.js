const { equal } = require("joi");
const model = require("../../models/metadata.model");
const api = require("../../tools/common");

const getAllPayable = async (req, res) => {
  try {
    let data = await model.getAllPayable();
    return api.ok(res, data);
  } catch (e) {
    return api.error(res, e, 500);
  }
};

const getAllReceivable = async (req, res) => {
  try {
    let data = await model.getAllReceivable();
    return api.ok(res, data);
  } catch (e) {
    return api.error(res, e, 500);
  }
};

const insertFromMinio = async (filePath) => {
  try {
    if (!filePath) {
      return "Invalid File Path";
    }

    // Split berdasarkan '/'
    const parts = filePath.split("/");

    // Extract komponen-komponen dari filepath
    const jenisAkun = parts[0]; // AccountPayable
    const nobox = parts[1]; // 24087-001
    const lastPart = parts[2]; // BCA_ED 889068_20240314_200000
    const filename = parts[3]; // filenam (file name)

    // Regex untuk bagian terakhir (namaBank, nocek, transaksiDate, nilai)
    const regex = /([A-Za-z0-9_]+)\s(\d+)_([0-9]{8})_(\d+)/;
    const match = lastPart.match(regex);

    if (match) {
      const namaBank = match[1]; // BCA_ED
      const nocek = match[2]; // 889068
      const transaksiDate = match[3]; // 20240314
      const nilai = parseInt(match[4]); // 200000

      let data = {
        jenisAkun,
        nobox,
        namaBank,
        nocek,
        transaksiDate,
        nilai,
        filename,
      };
      return "error";
    }
  } catch (e) {
    return "Internal Server Error";
  }
};

const getCountFile = async (req, res) => {
  try {
    let data = await model.getCountFile();
    return api.ok(res, data);
  } catch (e) {
    return api.error(res, "Internal Server Error", 500);
  }
};
const getAllDocumentName = async (req, res) => {
  try {
    let data = await model.getByDocumentName();
    return api.ok(res, data);
  } catch (e) {
    return api.error(res, "Internal Server Error", 500);
  }
};

const updateMetaData = async (req, res) => {
  const { id, documentName } = req.params;
  const newData = req.body;

  try {
    if (documentName === "ACOUNT PAYABLE") {
      let result = await model.updatePayable(id, newData);
      return api.ok(res, result);
    } else {
      let result = await model.updateReceivable(id, newData);
      return api.ok(res, result);
    }
  } catch (err) {
    return api.error(res, err, 500);
  }
};

module.exports = {
  getAllPayable,
  insertFromMinio,
  getCountFile,
  getAllDocumentName,
  getAllReceivable,
  updateMetaData,
};
