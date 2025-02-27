import  readXlsxFile from "./database.js";

export function printToConsole1(file: string){
    readXlsxFile(file);
    //console.log(file);
}