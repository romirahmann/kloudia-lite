const db = require("./../database/db.config");

const getAllPayable = async () =>
  await db
    .select(
      "ap.id",
      "ap.nobox",
      "ap.namaBank",
      "ap.noCek",
      "ap.transaksiDate",
      "ap.nilai",
      "ap.filename",
      "ap.filePath",
      "ap.document_id",
      "d.documentName"
    )
    .from("acountpayable as ap")
    .join("documents as d", "d.document_id", "ap.document_id");

const getAllReceivable = async () =>
  await db
    .select(
      "as.id",
      "as.nobox",
      "as.document_id",
      "as.noReceipt",
      "as.receiptDate",
      "as.customer",
      "as.nominal",
      "as.filename",
      "as.filePath",
      "d.documentName"
    )
    .from("acountrecievable as as")
    .join("documents as d", "d.document_id", "as.document_id");

const getByDocumentName = async () => db("documents").select("documentName");

const getCountFile = async () => {
  const result = await db("acountpayable").count("filename as count");
  return result[0].count; // Mengakses hasil count
};

const insertPayable = async (data) => await db("acountpayable").insert(data);
const insertReceivable = async (data) =>
  await db("acountrecievable").insert(data);

const updatePayable = async (id, data) =>
  await db("acountpayable").where("id", id).update(data);
const updateReceivable = async (id, data) =>
  await db("acountrecievable").where("id", id).update(data);

const delAP = async (id) => await db("acountpayable").where("id", id).delete();
const delAR = async (id) =>
  await db("acountrecievable").where("id", id).delete();

module.exports = {
  getAllPayable,
  insertPayable,
  insertReceivable,
  getCountFile,
  getByDocumentName,
  getAllReceivable,
  delAP,
  delAR,
  updatePayable,
  updateReceivable,
};
