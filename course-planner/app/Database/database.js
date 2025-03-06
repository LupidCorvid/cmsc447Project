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

  readXlsxFile(filepath).then((rows) => {
    console.log(rows)
  })
}

//export default readXlsxFile;
  