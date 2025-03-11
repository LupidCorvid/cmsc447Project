import React from "react";
import Image from "next/image";
import  { printToConsole }  from "./Database/database.js";

const filepath = "./Database/TestDatabase.xlsx";

const map = {
  'COURSE': {
    'course': {
      'NAME': 'courseName',
      'NUMBER': 'courseNumber'
    }
  }
}

function App() {

  //printToConsole();

  //console.log(readXlsxFile(filepath));
  
  return (
    <html>
      <head>
        <script src="./read-excel-file.min.js"></script>
        <script src="./lib/promise-polyfill.min.js"></script>
        <script src="./lib/prism.js"></script>
      </head>
      <body>
        <div className="App">
          <h1>Hello World!</h1>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
        <script>
          var input = document.getElementById('input');
          readXlsxFile(input.files[0]).then(function(rows){
            //document.getElementById('result').style.display = 'block'
          })
        </script>
      </body>
    </html>
  );
}

export default App;
