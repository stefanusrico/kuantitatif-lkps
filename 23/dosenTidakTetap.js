const { Parser } = require("expr-eval")
const fs = require("fs")

const parser = new Parser()

parser.functions.if = function (condition, trueValue, ...elseValues) {
  if (condition) {
    return trueValue
  }

  for (let i = 0; i < elseValues.length; i += 2) {
    if (i + 1 === elseValues.length) {
      return elseValues[i]
    } else if (elseValues[i]) {
      return elseValues[i + 1]
    }
  }
  return null
}

function readJsonSync(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(rawData)
    return data
  } catch (error) {
    console.error("Error reading JSON file:", error.message)
    return []
  }
}

function readJsonLengthSync(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(rawData)
    return data.length
  } catch (error) {
    console.error("Error reading JSON file:", error)
    return 0
  }
}

function readJumlahDosenTidakTetap(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(rawData)
    const jumlahDosen = data.filter((item) => item.nama_dosen != "").length

    console.log(`Jumlah dosen : ${jumlahDosen}`)
    return jumlahDosen
  } catch (error) {
    console.error("Error reading JSON file:", error.message)
    return []
  }
}

function readJumlahKesesuaianDosenTetap(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(rawData)
    const jumlahKesesuaian = data.filter(
      (item) => item.kesesuaian_dengan_kompetensi_inti_ps != ""
    ).length

    console.log(`Jumlah dosen dengan kesesuaian: ${jumlahKesesuaian}`)
    return jumlahKesesuaian
  } catch (error) {
    console.error("Error reading JSON file:", error.message)
    return []
  }
}

const variabelDosenTIdakTetap = {
  NDTT: readJumlahDosenTidakTetap("../data/3a4.json"),
  NDT: readJsonLengthSync("../data/3a1.json"),
  NDTPS: readJumlahKesesuaianDosenTetap("../data/3a1.json"),
}

variabelDosenTIdakTetap.PDTT =
  (variabelDosenTIdakTetap.NDTT /
    (variabelDosenTIdakTetap.NDT + variabelDosenTIdakTetap.NDTT)) *
  100

console.log(variabelDosenTIdakTetap)

const formula = `
if(PDTT == 0 and NDTPS >= 5, 4,
if(PDTT > 0 and PDTT <= 40 and NDTPS >= 5, 4-(5*PDTT/100),
if(PDTT > 40 and PDTT < 60 and NDTPS >= 5, 1,
if(PDTT > 60, 0, 0)
)))
`
const result = parser.evaluate(formula, variabelDosenTIdakTetap)

console.log(result)