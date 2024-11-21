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


const data = readJsonSync("../data/3a3.json")

const averageWaktuPerSemester =
  data.reduce((sum, item) => {
    return sum + parseFloat(item["jumlah_per_semester"].replace(",", "."))
  }, 0) / data.length

const variabelEkuivalensiWaktuPenuhDTPS = {
  EWMP: 0,
}

variabelEkuivalensiWaktuPenuhDTPS.EWMP = averageWaktuPerSemester

const formula = `
  if(EWMP == 14, 4,
    if(EWMP > 14 and EWMP <= 16, (50-(3*EWMP))/2,
      if(EWMP >= 12 and EWMP < 14, ((3*EWMP)-34)/2,
      if(EWMP < 12 or EWMP > 16, 0, 0)
    )))
  `

const result = parser.evaluate(formula, variabelEkuivalensiWaktuPenuhDTPS)

console.log(result)
