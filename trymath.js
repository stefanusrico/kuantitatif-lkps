// const math = require("mathjs")
const { create, all } = require("mathjs")
const math = create(all)

math.import(
  {
    if: function (condition, trueValue, falseValue) {
      return condition ? trueValue : falseValue
    },
  },
  { override: true }
)

// Menggunakan fungsi if dalam ekspresi
const result = math.evaluate('if(3 > 2, "Benar", "Salah")')
console.log(result) // Output: "Benar"

// Menggunakan kondisi untuk perhitungan
const conditionalResult = math.evaluate("if(5 > 3, 10 + 2, 5 * 2)")
console.log(conditionalResult) // Output: 12
