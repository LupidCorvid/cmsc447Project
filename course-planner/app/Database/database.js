/*
Planning/Links:
-Convert table data to JSON (https://oss.sheetjs.com/sheetjs/)
    https://stackoverflow.com/questions/8238407/how-to-parse-excel-xls-file-in-javascript-html5
    https://www.npmjs.com/package/read-excel-file -> npm install read-excel-file --save

-Import table data every time on launch (of main server)
*/

import readXlsxFile from "read-excel-file" //read-excel-file/node
import convertToJson from "read-excel-file/map"
//const { rows, errors } = convertToJson(data, schema, options)

export function printToConsole(){
  const filepath = "public/TestDatabase.xlsx"; //"./Database/TestDatabase.xlsx" //"TestDatabase.xlsx"
  const map = {
    'COURSE': {
      'course': {
        'NAME': 'courseName',
        'NUMBER': 'courseNumber'
      }
    }
  }
  //console.log("test")
  //console.log(readXlsxFile(filepath)); //console.log is fine. The readXlsxFile function is saying invalid zip data

  var input = document.getElementById('input')
  var input = 

  readXlsxFile(input.files[0]).then(function(data) {
    // `data` is an array of rows
    // each row being an array of cells.
    // document.getElementById('result').innerText = JSON.stringify(data, null, 2)
    document.getElementById('loading').style.display = 'none'
    document.getElementById('result').style.display = 'block'
    document.getElementById('result-data').innerHTML = Prism.highlight(
      JSON.stringify(data, null, 2),
      Prism.languages.javascript,
      'javascript'
    )
  })

  /*readXlsxFile(filepath).then((rows) => {
    console.log(rows)
  })*/
}
