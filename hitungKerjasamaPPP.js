const { Parser } = require("expr-eval")
const fs = require("fs")

const parser = new Parser()

parser.functions.if = function (condition, trueValue, falseValue) {
  return condition ? trueValue : falseValue
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

function readJumlahKesesuaianDosenTetap(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(rawData)
    const jumlahKesesuaian = data.filter(
      (item) => item.kesesuaian_dengan_kompetensi_inti_ps === "V"
    ).length

    console.log(`Jumlah dosen dengan kesesuaian: ${jumlahKesesuaian}`)
    return jumlahKesesuaian
  } catch (error) {
    console.error("Error reading JSON file:", error.message)
    return []
  }
}

const variabelKerjasamaPendidikanPenelitianPKM = {
  a: 3,
  b: 1,
  c: 2,
  N1: readJsonLengthSync("1-1.json"),
  N2: readJsonLengthSync("1-2.json"),
  N3: readJsonLengthSync("1-3.json"),
  NDTPS: readJumlahKesesuaianDosenTetap("3a1.json"),
}

console.log("NDTPS", variabelKerjasamaPendidikanPenelitianPKM.NDTPS)

const formulaRK = "((a * N1) + (b * N2) + (c * N3)) / NDTPS"

const RK = parser.evaluate(formulaRK, variabelKerjasamaPendidikanPenelitianPKM)

console.log(RK)
