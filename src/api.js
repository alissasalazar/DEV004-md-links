import chalk from "chalk";

console.log(chalk.blue("Hello world!"));
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

// valida si existe una ruta V/F
const existPath = (route) => fs.existsSync(route);

//valida si es una ruta absoluta V/F
const isAbs = (route) => path.isAbsolute(route);

// Transformar de ruta relativa a ruta absoluta
const changeRoute = (route) => (isAbs(route) ? route : path.resolve(route));

//Leer los archivos,nos dará el contenido del archivo
const readArch = (route) => fs.readFileSync(route, "utf-8");

//Leer contenido del directorio, nos dará un array
const readDir = (route) => fs.readdirSync(route, "utf-8");

//Si es un directorio tendremos que unir el directorio con su base
const joinRoute = (dir, base) => path.join(dir, base);

//Validar si es archivo o directorio
const hasExt = (route) => {
  if (path.parse(route).ext !== "") {
    const typeFile = path.parse(route).ext;
    //retornamos la extensión del archivo
    return typeFile;
  } else {
    //Es un directorio
    return false;
  }
};

// ------API-----

const getMdFiles = (path) => {
  let mdFiles = [];
  if (existPath(path)) {
    const pathAbs = changeRoute(path);
    const typeFile = hasExt(pathAbs);
    if (typeFile) {
      if (typeFile === ".md") {
        mdFiles = mdFiles.concat(pathAbs);
        return mdFiles;
      } else {
        return "No es un archivo markdown";
      }
    } else {
      const contDir = readDir(pathAbs);
      contDir.forEach((file) => {
        const unitePath = joinRoute(pathAbs, file);
        const recursiveFunct = getMdFiles(unitePath);
        mdFiles = mdFiles.concat(recursiveFunct);
      });
      return mdFiles.length !== 0 ? mdFiles : "Directorio Vacio";
    }
  } else {
    return "Ruta inexistente";
  }
};

//Para encontrar el url, nombre de url, y nombre + url usaremos expresiones regulares (Regex)
const linkRegex = /https?:\/\/(www\.)?[A-z\d]+(\.[A-z]+)*(\/[A-z\?=&-\d]*)*/g;
const nameRegex = /\[[^\s]+(.+?)\]/gi;
const nameLinkRegex = /\[(.+?)\]\((https?.+?)\)/g;

//Conseguir las propiedades de los links en un array

const getProp = (path) => {
  const arrayProp = [];
  const justMdFiles = getMdFiles(path).filter(
    (a) => a !== "No es un archivo markdown" && a !== "Directorio Vacio"
  );
  justMdFiles.forEach((mdFiles) => {
    const contFile = readArch(mdFiles);
    const matchLinks = contFile.match(nameLinkRegex);
    if (matchLinks) {
      matchLinks.forEach((link) => {
        const href = link.match(linkRegex).join();
        const text = link.match(nameRegex).join().slice(1, -1);
        arrayProp.push({
          href,
          text,
          file: mdFiles,
        });
      });
      return arrayProp;
    } else {
      //En el caso que hayan null
      arrayProp.push({
        href: "Los archivos no contienen links",
        text: "",
        file: mdFiles,
      });
      return arrayProp;
    }
  });
  return arrayProp;
};

// colocar el status que tiene los links,usaremos fetch para realizar la promesa
const validater = (arr) =>
  Promise.all(
    arr.map((obj) => {
      return fetch(obj.href)
        .then((res) => {
          const fetchProp = {
            href: obj.href,
            text: obj.text,
            file: obj.file,
            status: res.status,
            message: res.ok ? "OK" : "FAIL",
          };
          return fetchProp;
        })
        .catch(() => {
          const fetchProp = {
            href: obj.href,
            text: obj.text,
            file: obj.file,
            status:400,
            message: "FAIL",
          };
          return fetchProp;
        });
    })
  )

// console.log("Existe una ruta?".bgGreen,existPath("./src/example.md"))
// console.log("Es una ruta absoluta?".bgMagenta,isAbs("./src/example.md"))
// console.log("cambia la ruta a absoluta".bgBlue,changeRoute('./src/example.md'))
// console.log("Si es un archivo nos mostrara la extension".bgWhite,hasExt('./src/example.md'))
// console.log("1. muestra file md?".bgCyan,getMdFiles('./src'))
// console.log("2. muestra file md?".bgCyan,getMdFiles('./src/prueba.txt'))
// console.log("3. muestra file md?".bgCyan,getMdFiles('./src/prueba2.txt'))
// console.log("4. muestra file md?".bgCyan,getMdFiles('./readme.md'))
// console.log("4. muestra file md?".bgCyan,getMdFiles('./vacio'))
// console.log(
//   "Se obtuvieron las propiedades del link".bgCyan,
//   getProp("./src/example.md")
// );
// const prop=getProp();
// console.log("preoo",prop)

  validater(getProp("./readme.md")).then((val) => console.log(val))

