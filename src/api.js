// const colors  = require("colors");
const fs = require("fs");
const path = require("path");
// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require("axios");

console.log("Hello world!");

// valida si existe una ruta V/F
const existPath = (route) => fs.existsSync(route);

// valida si es una ruta absoluta V/F
const isAbs = (route) => path.isAbsolute(route);

// Transformar de ruta relativa a ruta absoluta
const changeRoute = (route) => (isAbs(route) ? route : path.resolve(route));
console.log("ruta absoluta", changeRoute('./readme.md'))

// Leer los archivos,nos dará el contenido del archivo
const readArch = (route) => fs.readFileSync(route, "utf-8");

// Leer contenido del directorio, nos dará un array
const readDir = (route) => fs.readdirSync(route, "utf-8");

// Si es un directorio tendremos que unir el directorio con su base
const joinRoute = (dir, base) => path.join(dir, base);

// Validar si es archivo o directorio
const hasExt = (route) => {
  if (path.parse(route).ext !== "") {
    const typeFile = path.parse(route).ext;
    // retornamos la extensión del archivo
    return typeFile;
  }
  // Es un directorio
  return false;
};

// ------API-----

const getMdFiles = (route) => {
  let mdFiles = [];
  if (existPath(route)) {
    const pathAbs = changeRoute(route);
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

// Para encontrar el url, nombre de url, y nombre + url usaremos expresiones regulares (Regex)
const linkRegex = /https?:\/\/(www\.)?[A-z\d]+(\.[A-z]+)*(\/[A-z?=&-\d]*)*/g;
const nameRegex = /\[[^\s]+(.+?)\]/gi;
const nameLinkRegex = /\[(.+?)\]\((https?.+?)\)/g;

// Conseguir las propiedades de los links en un array

const getProp = (route) => {
  const arrayProp = [];
  const justMdFiles = getMdFiles(route).filter(
    (a) => a !== "No es un archivo markdown" && a !== "Directorio Vacio",
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
      // En el caso que hayan null
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

// colocar el status que tiene los links,usaremos axios para realizar la peticion http y conseguir el estado
const validater = (arr) =>
  Promise.all(
    arr.map((obj) => {
      return axios.get(obj.href)
        .then((res) => {
          const axiosProp = {
            href: obj.href,
            text: obj.text.substring(0, 50),
            file: obj.file,
            status: res.status,
            message: res.ok ? "OK" : "FAIL",
          };
          return axiosProp;
        })
        .catch(() => {
          const axiosProp = {
            href: obj.href,
            text: obj.text.substring(0, 50),
            file: obj.file,
            status: 400,
            message: "FAIL",
          };
          return axiosProp;
        });
    }),
  );

// Se coloca un then al llamar a la función Validater porque el "all promise" tambien debe finalizar
// validater(getProp("./readme.md")).then((val) => console.log(val));

module.exports = {
  existPath,
  isAbs,
  changeRoute,
  readArch,
  readDir,
  joinRoute,
  hasExt,
  getMdFiles,
  getProp,
  validater,
};
