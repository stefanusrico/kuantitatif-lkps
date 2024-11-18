const express = require("express")
const { google } = require("googleapis")
const app = express()
const fs = require("fs")
const PORT = process.env.PORT || 3000
const keyFilePath = "data/elkapees-009735b713b8.json"
const path = require("path")

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
})

const getTingkat = (row) => {
  if (row[2] === "V") return "Internasional"
  if (row[3] === "V") return "Nasional"
  if (row[4] === "V") return "Wilayah/Lokal"
  return ""
}

const getDataTabelKerjasama = async (spreadsheetId, range, outputFile) => {
  const client = await auth.getClient()
  const sheets = google.sheets({ version: "v4", auth: client })

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
    majorDimension: "ROWS",
  })

  const rows = response.data.values
  if (!rows || rows.length === 0) {
    return []
  }

  const formattedDataTabelKerjasama = rows
    .filter((row) => row[0] && row[1]) // Filter out empty rows
    .map((row) => ({
      nomor: row[0] || "",
      lembaga_mitra: row[1] || "",
      tingkat: getTingkat(row),
      judul_kegiatan: row[5] || "",
      manfaat: row[6] || "",
      tanggal_awal_kerjasama: row[7] || "",
      tanggal_akhir_kerjasama: row[8] || "",
      "durasi(tahun)": row[9] || "",
      status_kerjasama: row[10] || "",
      bukti_kerjasama: row[11] || "",
    }))

  fs.writeFileSync(
    outputFile,
    JSON.stringify(formattedDataTabelKerjasama, null, 2)
  )

  return formattedDataTabelKerjasama
}

const getDataTabelDosenTetap = async (spreadsheetId, range, outputFile) => {
  const client = await auth.getClient()
  const sheets = google.sheets({ version: "v4", auth: client })

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
    majorDimension: "ROWS",
  })

  const rows = response.data.values
  if (!rows || rows.length === 0) {
    return []
  }

  const formattedDataTabelDosenTetap = rows
    .filter((row) => row[0] && row[1]) // Filter out empty rows
    .map((row) => ({
      nomor: row[0] || "",
      nama_dosen: row[1] || "",
      "nidn/nidk": row[2] || "",
      nama_prodi_pasca_sarjana: {
        "magister/magister_terapan": row[3] || "",
        "doktor/doktor_terapan": row[4] || "",
      },
      bidang_keahlian: row[5] || "",
      kesesuaian_dengan_kompetensi_inti_ps: row[6] || "",
      jabatan_akademik: row[7] || "",
      nomor_sertifikat_pendidik_profesional: row[8] || "",
      sertifikat_kompetensi: {
        bidang_sertifikat: row[9] || "",
        lembaga_penerbit: row[10] || "",
      },
      mata_kuliah_diampu: row[11] || "",
      kesesuaian_bidang_keahlian_dengan_mk: row[12] || "",
      mata_kuliah_diampu_pada_ps_lain: row[13] || "",
    }))

  fs.writeFileSync(
    outputFile,
    JSON.stringify(formattedDataTabelDosenTetap, null, 2)
  )

  return formattedDataTabelDosenTetap
}

const getDataTabelSeleksiMahasiswa = async (
  spreadsheetId,
  range,
  outputFile
) => {
  const client = await auth.getClient()
  const sheets = google.sheets({ version: "v4", auth: client })

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
    majorDimension: "ROWS",
  })

  const rows = response.data.values
  if (!rows || rows.length === 0) {
    return []
  }

  const formattedDataTabelSeleksiMahasiswa = rows
    .filter((row) => row[0] && row[1]) // Filter out empty rows
    .map((row) => ({
      tahun_akademik: row[0] || "",
      daya_tampung: row[1] || "",
      jumlah_calon_mahasiswa: {
        pendaftar: row[2] || "",
        lulus: row[3] || "",
      },
      jumlah_mahasiswa_baru: {
        reguler: row[4] || "",
        transfer: row[5] || "",
      },
      jumlah_mahasiswa_aktif: {
        reguler: row[6] || "",
        transfer: row[7] || "",
      },
    }))

  fs.writeFileSync(
    outputFile,
    JSON.stringify(formattedDataTabelSeleksiMahasiswa, null, 2)
  )

  return formattedDataTabelSeleksiMahasiswa
}

const createTableRouteKerjasama = (sheetName, tableNumber, rangeCells) => {
  return async (req, res) => {
    try {
      const spreadsheetId = "1vv5jRRM_l2m-TN6yRCz8EO4sFXjQe3Q9C4hmAZWHNhE"
      const range = `'${sheetName}'!${rangeCells}`
      const outputFile = path.join(__dirname, "data", `${tableNumber}.json`)

      const data = await getDataTabelKerjasama(spreadsheetId, range, outputFile)
      res.status(200).json(data)
    } catch (error) {
      res
        .status(500)
        .send("Error fetching data from Google Sheets: " + error.message)
    }
  }
}

const createTableRouteDosenTetap = (sheetName, tableNumber, rangeCells) => {
  return async (req, res) => {
    try {
      const spreadsheetId = "1vv5jRRM_l2m-TN6yRCz8EO4sFXjQe3Q9C4hmAZWHNhE"
      const range = `'${sheetName}'!${rangeCells}`
      const outputFile = path.join(__dirname, "data", `${tableNumber}.json`)

      const data = await getDataTabelDosenTetap(
        spreadsheetId,
        range,
        outputFile
      )
      res.status(200).json(data)
    } catch (error) {
      res
        .status(500)
        .send("Error fetching data from Google Sheets: " + error.message)
    }
  }
}

const createTableRouteSeleksiMahasiswa = (
  sheetName,
  tableNumber,
  rangeCells
) => {
  return async (req, res) => {
    try {
      const spreadsheetId = "1vv5jRRM_l2m-TN6yRCz8EO4sFXjQe3Q9C4hmAZWHNhE"
      const range = `'${sheetName}'!${rangeCells}`
      const outputFile = path.join(__dirname, "data", `${tableNumber}.json`)

      const data = await getDataTabelSeleksiMahasiswa(
        spreadsheetId,
        range,
        outputFile
      )
      res.status(200).json(data)
    } catch (error) {
      res
        .status(500)
        .send("Error fetching data from Google Sheets: " + error.message)
    }
  }
}

// Create routes for each table
app.get("/data/tabel/1-1", createTableRouteKerjasama("1-1", "1-1", "A12:L49"))
app.get("/data/tabel/1-2", createTableRouteKerjasama("1-2", "1-2", "A12:L49"))
app.get("/data/tabel/1-3", createTableRouteKerjasama("1-3", "1-3", "A12:L49"))
app.get("/data/tabel/3a1", createTableRouteDosenTetap("3a1", "3a1", "A14:N45"))
app.get("/data/tabel/3a4", createTableRouteDosenTetap("3a4", "3a4", "A14:N45"))
app.get(
  "/data/tabel/2a1",
  createTableRouteSeleksiMahasiswa("2a1", "2a1", "A7:H11")
)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
