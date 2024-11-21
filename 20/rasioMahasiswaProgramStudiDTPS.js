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

function calculateRMDAndScore(NM, NDTPS) {
  const rmdExpression = parser.parse("NM / NDTPS")
  const rmd = rmdExpression.evaluate({ NM, NDTPS })

  const scoreExpression = parser.parse(`
    if(RMD >= 15 and RMD <= 25, 4,
      if(RMD < 15, (4 * RMD) / 15,
        if(RMD > 25 and RMD <= 35, (70 - (2 * RMD)) / 5,
          0)))
  `)

  const score = scoreExpression.evaluate({ RMD: rmd })

  return { rmd, score }
}

const mahasiswaData = readJsonSync("../data/2a1.json")
const NDTPS = readJumlahKesesuaianDosenTetap("../data/3a1.json")

console.log("\nHasil Perhitungan RMD dan Skor:")
console.log("================================")

mahasiswaData.forEach((item) => {
  const mahasiswaReguler = parseInt(item.jumlah_mahasiswa_aktif.reguler) || 0
  const mahasiswaTransfer = parseInt(item.jumlah_mahasiswa_aktif.transfer) || 0
  const NM = mahasiswaReguler + mahasiswaTransfer

  const { rmd, score } = calculateRMDAndScore(NM, NDTPS)

  console.log(`\nTahun Akademik: ${item.tahun_akademik}`)
  console.log(`NM (Jumlah Mahasiswa): ${NM}`)
  console.log(`NDTPS: ${NDTPS}`)
  console.log(`RMD: ${rmd.toFixed(2)}`)
  console.log(`Skor: ${score.toFixed(2)}`)
})
