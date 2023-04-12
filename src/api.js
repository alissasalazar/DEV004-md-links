/* eslint-disable prefer-promise-reject-errors */
const colors = require("colors");

const fs = require("fs");
const path = require("path");

// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require("axios");

// console.log("Hello world!");

// valida si existe una ruta V/F
const existPath = (route) => fs.existsSync(route);

// valida si es una ruta absoluta V/F
const isAbs = (route) => path.isAbsolute(route);

// Transformar de ruta relativa a ruta absoluta
const changeRoute = (route) => (isAbs(route) ? route : path.resolve(route));

// Leer los archivos,nos dará el contenido del archivo
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

// Leer contenido del directorio, nos dará un array
const readDir = (route) => fs.readdirSync(route, "utf-8");

// Si es un directorio tendremos que unir el directorio con su base
const joinRoute = (dir, base) => path.join(dir, base);

// Validar si es archivo o directorio
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
      // Leer todo el contenido del archivo
      const contDir = readDir(pathAbs);
      contDir.forEach((file) => {
        // Unimos la ruta absoluta con el archivo
        const unitePath = joinRoute(pathAbs, file);
        // Usamos la recursividad para que obtenga los archivos ".md" nada más
        const recursiveFunct = getMdFiles(unitePath);
        mdFiles = mdFiles.concat(recursiveFunct);
      });
      return mdFiles.length !== 0 ? mdFiles : "Directorio Vacio";
    }
  } else {
    return "Ruta inexistente";
  }
};

// console.log("call getMdfiles", getMdFiles("./src/directorio"))
// Para encontrar el url, nombre de url, y nombre + url usaremos expresiones regulares (Regex)
const linkRegex = /https?:\/\/(www\.)?[A-z\d]+(\.[A-z]+)*(\/[A-z?=&-\d]*)*/g;
const nameRegex = /\[[^\s]+(.+?)\]/gi;
const nameLinkRegex = /\[(.+?)\]\((https?.+?)\)/g;

// Conseguir las propiedades de los links en un array

const getProp = (route) => {
  return new Promise((resolve, reject) => {
    const arrayProp = [];
    const justFiles = getMdFiles(route).filter(
      (e) => e !== "No es un archivo markdown" && e !== "Directorio Vacio"
    );
    justFiles.forEach((mdfile) => {
      readArch(mdfile)
        .then((file) => {
          const matchLinks = file.match(nameLinkRegex);
          if (matchLinks) {
            matchLinks.forEach((link) => {
              const href = link.match(linkRegex).join();
              const text = link.match(nameRegex).join().slice(1, -1);
              arrayProp.push({
                href,
                text,
                file: route,
              });
            });
            resolve(arrayProp);
          } else {
            // En el caso que hayan null
            arrayProp.push({
              href: "Los archivos no contienen links",
              text: "",
              file: route,
            });
            resolve(arrayProp);
          }
        })
        .catch((err) => reject(err));
    });
  });
};
getProp("./src/direct")
  .then((res) => {
    console.log("respuesta de getProp", res);
  })
  .catch((err) => {
    console.log("error de getProp", err);
  });
// colocar el status que tiene los links,usaremos axios para realizar la peticion http y conseguir el estado
const validater = (arr) => {
  return Promise.all(
    arr.map((obj) => {
      return axios
        .get(obj.href)
        .then((res) => {
          const axiosProp = {
            href: obj.href,
            text: obj.text.substring(0, 50),
            file: obj.file,
            status: res.status,
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
            message: "FAIL",
          };
          return axiosProp;
        });
    })
  );
};

// const searchLineInText = (lineArr, textSearch) => {
//   const numbLines = lineArr
//     .map((line, index) => (line.includes(textSearch) ? index + 1 : -1))
//     .filter((e) => e !== -1);
//   return numbLines;
// };
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
