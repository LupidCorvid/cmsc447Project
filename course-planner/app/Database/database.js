/*
Planning/Links:
-Convert table data to JSON (https://oss.sheetjs.com/sheetjs/)
    https://stackoverflow.com/questions/8238407/how-to-parse-excel-xls-file-in-javascript-html5
    https://www.npmjs.com/package/read-excel-file -> npm install read-excel-file --save

-Import table data every time on launch (of main server)
*/

import readXlsxFile from 'read-excel-file'
import convertToJson from "read-excel-file/map"
const readXlsxFile = require('read-excel-file/node') //From package's website

const map = {
  'COURSE': {
    'course': {
      'NAME': 'courseName',
      'NUMBER': 'courseNumber'
    }
  }
}

// File path.
// `rows` is an array of rows
// each row being an array of cells.
readXlsxFile({file}, { map }).then(({ rows }) => {
  /*rows == [{
    course: {
      courseName: 'CMSC',
      courseNumber: 201
    }
  }]*/
  console.log(rows);
})

// Readable Stream.
readXlsxFile(fs.createReadStream('/path/to/file')).then((rows) => {
  // `rows` is an array of rows
  // each row being an array of cells.
})

// Buffer.
readXlsxFile(Buffer.from(fs.readFileSync('/path/to/file'))).then((rows) => {
  // `rows` is an array of rows
  // each row being an array of cells.
})

export function printToConsole(file){
  readXlsxFile(file, map);
}

export default readXlsxFile;
  