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

function readJabatanAkademik(filePath, jabatan) {
  try {
    const rawData = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(rawData)
    const jumlahGuruBesar = data.filter(
      (item) =>
        item.jabatan_akademik === jabatan &&
        item.kesesuaian_dengan_kompetensi_inti_ps === "V"
    ).length
    return jumlahGuruBesar
  } catch (error) {
    console.error("Error reading JSON file:", error.message)
    return []
  }
}

const variabelJabatanAkademikDTPS = {
  NDGB: readJabatanAkademik("3a1.json", "Guru Besar"),
  NDLK: readJabatanAkademik("3a1.json", "Lektor Kepala"),
  NDL: readJabatanAkademik("3a1.json", "Lektor"),
  NDTPS: readJumlahKesesuaianDosenTetap("3a1.json"),
}

variabelJabatanAkademikDTPS.PGBLKL =
  ((variabelJabatanAkademikDTPS.NDGB +
    variabelJabatanAkademikDTPS.NDLK +
    variabelJabatanAkademikDTPS.NDL) /
    variabelJabatanAkademikDTPS.NDTPS) *
  100

console.log(variabelJabatanAkademikDTPS)

const formula = `
  if(PGBLKL >= 50, 4,
  if(PGBLKL < 50, max(2, 2 + ((20 * (PGBLKL/100)/5))),0))`

const result = parser.evaluate(formula, variabelJabatanAkademikDTPS)
console.log("Skor:", result)
