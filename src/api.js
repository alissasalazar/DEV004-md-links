/* eslint-disable prefer-promise-reject-errors */
const colors = require("colors");
const process = require("node:process");
const fs = require("fs");
const path = require("path");

// eslint-disable-next-line import/no-extraneous-dependencies
// Axios realiza peticiones http desde node.js,basado en promesas
const axios = require("axios");

// Comprobar de forma síncrona si un archivo existe en la ruta dada o no --> (V/F)
const existFile = (route) => fs.existsSync(route);

// valida si es una ruta absoluta --> (V/F)
const isAbs = (route) => path.isAbsolute(route);

// Transformar de ruta relativa a ruta absoluta --> string
const changeRoute = (route) => (isAbs(route) ? route : path.resolve(route));

// Leer los archivos,nos dará el contenido del archivo --> objeto de promesa
const readArch = (route) =>
  new Promise((resolve, reject) => {
    fs.readFile(route, "utf-8", (err, data) => {
      if (err) {
        reject(colors.bgRed("No se puede leer el archivo"));
      } else {
        resolve(data);
      }
    });
  });

// const result = readArch("./src/example2.md");
// result
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Leer contenido del directorio --> array
const readDirectory = (route) => fs.readdirSync(route, "utf-8");

//  Une los segmentos de ruta, especificados, en una sola ruta. --> una nueva ruta
const joinRoute = (route, file) => path.join(route, file);

// Usando el metodo path.parse nos devolverá las propiedades del link y de ahi tomaremos "ext" para obtener la extension
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
// Validar si los archivos son md/ si es un directorio, tomar los archivos y validarlos

const getMdFiles = (route) => {
  let mdFiles = [];
  if (existFile(route)) {
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
      // Leer todo el contenido del archivo
      const contDirect = readDirectory(pathAbs);
      if (contDirect.length === 0) {
        return "Directorio vacio";
      } else {
        contDirect.forEach((file) => {
          // Unimos la ruta absoluta con el archivo
          const unitePath = joinRoute(pathAbs, file);
          // Usamos la recursividad para que obtenga los archivos ".md" nada más
          const recursiveFunct = getMdFiles(unitePath);
          mdFiles = mdFiles.concat(recursiveFunct);
        });
        return mdFiles
      }
    }
  } else {
    return "No se encontro la ruta indicada.Por favor revisar";
  }
};
// const result = getMdFiles("vacio");
// console.log("que da result", result);
// console.log("call getMdfiles", getMdFiles("./src/vacio"));
// Para encontrar el url, nombre de url, y nombre + url usaremos expresiones regulares (Regex)

const linkRegex = /https?:\/\/(www\.)?[A-z\d]+(\.[A-z]+)*(\/[A-z?=&-\d]*)*/g;
const nameRegex = /\[[^\s]+(.+?)\]/gi;
const nameLinkRegex = /\[(.+?)\]\((https?.+?)\)/g;

// console.log("hay un array de archivos md?", arrayOfMdFiles("./src/directorio"));

// Filtrar solo los archivos markadown
const justMdFiles = (ruta) => {
  const arrmdFiles = getMdFiles(ruta).filter(
    (e) =>
      e !== "No es un archivo markdown" && e !== "No se encontro la ruta indicada.Por favor revisar"
  );
  return arrmdFiles;
};
// console.log("que da just", justMdFiles("./src/directorio/example3.md"))
// Obtener array de promesas
const arrayPromises = (ruta) =>
  justMdFiles(ruta).map((file) => {
    return readArch(file);
  });
// console.log("que es arrProm", arrayPromises("./src/directorio"));

// Conseguir las propiedades de los links en un array
const getPropertiesFiles = (route) => {
  return new Promise((resolve, reject) => {
    const arrPropertiesFile = [];
    Promise.all(arrayPromises(route))
      .then((file) => {
        const matchLinks = file.join().match(nameLinkRegex);
        const arrayLine = file.join().split("\n");
        if (matchLinks) {
          matchLinks.forEach((link) => {
            const href = link.match(linkRegex).join();
            const text = link.match(nameRegex).join().slice(1, -1);
            arrPropertiesFile.push({
              href,
              text,
              file: route,
              lines: arrayLine,
            });
          });
          resolve(arrPropertiesFile);
        } else {
          // En caso que haya archivos null
          arrPropertiesFile.push({
            href: "Los archivos no contienen Links para validar",
            text: "",
            file: route,
          });
          resolve(arrPropertiesFile);
        }
      })
      .catch((err) => {
        reject(console.log("No se pudo obtener las propiedades del link", err));
      });
  });
};
// getPropertiesFiles("./first.txt").catch((res) => console.log("que da de respuesta getProp", res))

// Buscar en que linea se ubica el link
const searchLineOfLink = (arrayLines, linktoSearch) => {
  // En el arreglo de lineas debe encontrar el link = +1 / sino dar como resultado -1
  const numberOfLink = arrayLines
    .map((line, index) => (line.includes(linktoSearch) ? index + 1 : -1))
    .filter((e) => e !== -1);
  return numberOfLink;
};

// colocar el status que tiene los links,usaremos axios para realizar la peticion http y conseguir el estado --> promesa
const validater = (arr) => {
  return Promise.all(
    arr.map((obj) => {
      const line = searchLineOfLink(obj.lines, obj.href);
      return axios
        .get(obj.href)
        .then((res) => {
          const axiosProp = {
            href: obj.href,
            text: obj.text.substring(0, 50),
            file: obj.file,
            status: res.status,
            lines: line,
            message: "OK",
          };
          return axiosProp;
        })
        .catch((err) => {
          const axiosProp = {
            href: obj.href,
            text: obj.text.substring(0, 50),
            file: obj.file,
            status: `Fail ${err.message}`,
            lines: line,
            message: "FAIL",
          };
          return axiosProp;
        });
    })
  );
};

module.exports = {
  existFile,
  isAbs,
  changeRoute,
  readArch,
  readDirectory,
  joinRoute,
  hasExt,
  getMdFiles,
  getPropertiesFiles,
  validater,
  justMdFiles,
  arrayPromises,
  process,
};
