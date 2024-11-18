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

function hitungTingkatKerjasamaMultiFile(fileNames) {
  let hasilTotal = {
    Nasional: 0,
    Internasional: 0,
    "Wilayah/Lokal": 0,
  }

  let hasilPerFile = []

  fileNames.forEach((fileName, index) => {
    const data = readJsonSync(fileName)
    if (!data.length) return

    let hasilFile = {
      Nasional: 0,
      Internasional: 0,
      "Wilayah/Lokal": 0,
    }

    data.forEach((item) => {
      if (item.tingkat in hasilFile) {
        hasilFile[item.tingkat]++
        hasilTotal[item.tingkat]++
      }
    })

    hasilPerFile.push({
      fileName,
      hasil: hasilFile,
      total: data.length,
    })
  })

  return {
    perFile: hasilPerFile,
    total: hasilTotal,
  }
}

const files = ["1-1.json", "1-2.json", "1-3.json"]

const hasil = hitungTingkatKerjasamaMultiFile(files)

// Menyimpan hasil perhitungan dalam variabel terpisah
const totalKerjasama = Object.values(hasil.total).reduce((a, b) => a + b, 0)
console.log(hasil.total.Internasional)

const kerjasamaInternasional = hasil.total.Internasional
const kerjasamaNasional = hasil.total.Nasional
const kerjasamaWilayah = hasil.total["Wilayah/Lokal"]

const variabelKerjasamaInternasionalNasionalWilayah = {
  a: 2,
  b: 6,
  c: 8,
  NI: kerjasamaInternasional,
  NN: kerjasamaNasional,
  NW: kerjasamaWilayah,
}

variabelKerjasamaInternasionalNasionalWilayah.A =
  variabelKerjasamaInternasionalNasionalWilayah.NI !== 0 &&
  variabelKerjasamaInternasionalNasionalWilayah.a !== 0
    ? variabelKerjasamaInternasionalNasionalWilayah.NI /
      variabelKerjasamaInternasionalNasionalWilayah.a
    : 0

variabelKerjasamaInternasionalNasionalWilayah.B =
  variabelKerjasamaInternasionalNasionalWilayah.NN !== 0 &&
  variabelKerjasamaInternasionalNasionalWilayah.b !== 0
    ? variabelKerjasamaInternasionalNasionalWilayah.NN /
      variabelKerjasamaInternasionalNasionalWilayah.b
    : 0

variabelKerjasamaInternasionalNasionalWilayah.C =
  variabelKerjasamaInternasionalNasionalWilayah.NW !== 0 &&
  variabelKerjasamaInternasionalNasionalWilayah.c !== 0
    ? variabelKerjasamaInternasionalNasionalWilayah.NW /
      variabelKerjasamaInternasionalNasionalWilayah.c
    : 0

console.log(variabelKerjasamaInternasionalNasionalWilayah.A)
console.log(variabelKerjasamaInternasionalNasionalWilayah.B)
console.log(variabelKerjasamaInternasionalNasionalWilayah.C)

// console.log(variabelKerjasamaInternasionalNasionalWilayah)
console.log("NI: ", kerjasamaInternasional)
console.log("NN: ", kerjasamaNasional)
console.log("NW: ", kerjasamaWilayah)

console.log("Total Kerjasama: ", kerjasamaInternasional+kerjasamaNasional+kerjasamaWilayah)

const formulaSkor = `
  if(
    NI >= a and NN >= b,
    4,
    (0 < NI and NI < a) or (0 < NN and NN < b) or (0 < NW and NW <= c),
    4 * ((A + B + (C / 2)) - (A * B) - ((A * C) / 2) - ((B * C) / 2) + ((A * B * C) / 2))
  )
`

const formula =
  "4 * ((A + B + (C / 2)) - (A * B) - ((A * C) / 2) - ((B * C) / 2) + ((A * B * C) / 2))"

const result = parser.evaluate(
  formulaSkor,
  variabelKerjasamaInternasionalNasionalWilayah
)
const hasi = parser.evaluate(formula, variabelKerjasamaInternasionalNasionalWilayah)

console.log("Ini adalah skor: ", result)

console.log("Ini adalah hasil: ", hasi)

console.log(0<0)