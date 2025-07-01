const db = require("./../database/db.config");

const getAllPayable = async (q, date) => {
  const query = db
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
      "ap.createdAt",
      "d.documentName"
    )
    .from("acountpayable as ap")
    .join("documents as d", "d.document_id", "ap.document_id");
  if (q) {
    query.where(function () {
      this.where("ap.nobox", "like", `${q}%`)
        .orWhere("ap.namaBank", "like", `${q}%`)
        .orWhere("ap.noCek", "like", `${q}%`)
        .orWhere("ap.fileName", "like", `${q}%`)
        .orWhere("ap.nilai", "like", `${q}%`);
    });
  }

  if (date) {
    query.where("ap.transaksiDate", "=", date);
  }

  query.orderBy("ap.createdAt", "desc");

  return await query;
};

const getAllReceivable = async (q, date) => {
  const query = db
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
      "as.createdAt",
      "d.documentName"
    )
    .from("acountrecievable as as")
    .join("documents as d", "d.document_id", "as.document_id");

  if (q) {
    query.where(function () {
      this.where("as.nobox", "like", `${q}%`)
        .orWhere("as.noReceipt", "like", `${q}%`)
        .orWhere("as.customer", "like", `${q}%`)
        .orWhere("as.filename", "like", `${q}%`)
        .orWhere("as.nominal", "like", `${q}%`);
    });
  }
  query.orderBy("as.createdAt", "desc");

  return await query;
};

const getPayableByFilter = async (filter) => {
  const query = db
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

  if (filter || filter.querySearch) {
    query.where(function () {
      this.where("ap.nobox", "like", `${filter.querySearch}%`)
        .orWhere("ap.namaBank", "like", `${filter.querySearch}%`)
        .orWhere("ap.noCek", "like", `${filter.querySearch}%`)
        .orWhere("ap.fileName", "like", `${filter.querySearch}%`)
        .orWhere("ap.nilai", "like", `${filter.querySearch}%`);
    });
  }

  return await query;
};

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
  getPayableByFilter,
};
