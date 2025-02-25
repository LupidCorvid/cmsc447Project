/*
Planning/Links:
-Convert table data to JSON (https://oss.sheetjs.com/sheetjs/)
    https://stackoverflow.com/questions/8238407/how-to-parse-excel-xls-file-in-javascript-html5
    https://www.npmjs.com/package/read-excel-file -> npm install read-excel-file --save

-Import table data every time on launch (of main server)
*/

import readXlsxFile from 'read-excel-file'

//Code is from package's website
const readXlsxFile = require('read-excel-file/node')

// File path.
readXlsxFile('/path/to/file').then((rows) => {
  // `rows` is an array of rows
  // each row being an array of cells.
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