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

const variabelKecupukanJumlahDTPS = {
  NDTPS: readJumlahKesesuaianDosenTetap("3a1.json"),
  NDTT: readJsonLengthSync("3a4.json"),
  NDT: readJsonLengthSync("3a1.json"),
}

variabelKecupukanJumlahDTPS.PDTT =
  (variabelKecupukanJumlahDTPS.NDTT /
    (variabelKecupukanJumlahDTPS.NDT + variabelKecupukanJumlahDTPS.NDTT)) *
  100
variabelKecupukanJumlahDTPS.A = (variabelKecupukanJumlahDTPS.NDTPS - 3) / 9
variabelKecupukanJumlahDTPS.B =
  (40 / 100 - variabelKecupukanJumlahDTPS.PDTT / 100) / (30 / 100)

console.log(variabelKecupukanJumlahDTPS)

const formula = `
  if(NDTPS >= 12 and PDTT <= 10, 4,
    if((NDTPS >= 12 and PDTT > 10 and PDTT <= 40) || (3 <= NDTPS and NDTPS < 12 and PDTT > 10 and PDTT <= 40), 2 + (2 * B),
      if(3 <= NDTPS and NDTPS < 12 and PDTT > 40, 1,
        if(NDTPS <= 3 and PDTT == 0, 0,
          0
        )
      )
    )
  )
`

const result = parser.evaluate(formula, variabelKecupukanJumlahDTPS)
console.log("Skor:", result)
