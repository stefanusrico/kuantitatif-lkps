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


function calculateRatios(data) {
  return data.map((item) => {
    const pendaftar = parseInt(item.jumlah_calon_mahasiswa.pendaftar)
    const lulus = parseInt(item.jumlah_calon_mahasiswa.lulus)
    const ratio = pendaftar / lulus

    return {
      tahun_akademik: item.tahun_akademik,
      rasio: Math.round(ratio.toFixed(1)),
    }
  })
}

function calculateScore(ratio) {
  const formulaB = `if(rasio >= 4, 4, (4*rasio)/4)`
  return parser.evaluate(formulaB, { rasio: ratio })
}

const data = readJsonSync("2a1.json")
const ratios = calculateRatios(data)

ratios.forEach((item) => {
  console.log(`${item.tahun_akademik}: ${item.rasio}`)
  const score = calculateScore(item.rasio)
  console.log(`Skor: ${score.toFixed(2)}`)
  console.log("---")
})