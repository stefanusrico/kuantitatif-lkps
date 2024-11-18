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

function readJumlahSertifikatKompetensi(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(rawData)
    const jumlahSertifikatKompetensi = data.filter(
      (item) => item.sertifikat_kompetensi.lembaga_penerbit != ""
    ).length

    console.log(`Jumlah dosen dengan kesesuaian: ${jumlahSertifikatKompetensi}`)
    return jumlahSertifikatKompetensi
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
      (item) => item.kesesuaian_dengan_kompetensi_inti_ps === "V"
    ).length

    console.log(`Jumlah dosen dengan kesesuaian: ${jumlahKesesuaian}`)
    return jumlahKesesuaian
  } catch (error) {
    console.error("Error reading JSON file:", error.message)
    return []
  }
}

const variabelSertifikatKompetensi = {
  NDSK: readJumlahSertifikatKompetensi("3a1.json"),
  NDTPS: readJumlahKesesuaianDosenTetap("3a1.json"),
}

variabelSertifikatKompetensi.PDSK =
  (variabelSertifikatKompetensi.NDSK / variabelSertifikatKompetensi.NDTPS) * 100

console.log(variabelSertifikatKompetensi)

const formula = `
  if(PDSK >= 50, 4,
    if(PDSK < 50, max(1, 1 + (6 * (PDSK/100))),0
    )
  )
`

const result = parser.evaluate(formula, variabelSertifikatKompetensi)
console.log("Skor:", result)
