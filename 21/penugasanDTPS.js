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

function readJumlahKesesuaianDosenTetap(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(rawData)
    const jumlahKesesuaian = data.filter((item) => item.nama_dosen != "").length

    console.log(`Jumlah dosen dengan kesesuaian: ${jumlahKesesuaian}`)
    return jumlahKesesuaian
  } catch (error) {
    console.error("Error reading JSON file:", error.message)
    return []
  }
}

const data = readJsonSync("../data/3a2.json")
const jumlahDosen = readJumlahKesesuaianDosenTetap("../data/3a2.json")
const averageBimbingan =
  data.reduce((sum, item) => {
    return (
      sum +
      parseFloat(
        item["rata-rata_jumlah_bimbingan_semua_program"].replace(",", ".")
      )
    )
  }, 0) / data.length

const variabelPenugasanDTPS = {
  RDPU: 0,
}

variabelPenugasanDTPS.RDPU = averageBimbingan

console.log(variabelPenugasanDTPS)

const formula = `
  if(RDPU <= 6, 4,
    if(RDPU > 6 and RDPU <= 10, max(2, 7 - (RDPU/2)),
      if(RDPU > 10, 0, 0
    )))
`

const result = parser.evaluate(formula, variabelPenugasanDTPS)

console.log(result)
