const colors = require("colors");
const api = require("./api.js");

const mdLinks = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!api.existPath(path)) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(colors.bgRed("La ruta introducida no existe"));
    } else {
      if (!options.validate) {
        if (api.getMdFiles(path) !== "Directorio vacio") {
          api
            .getProp(path)
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              resolve(err);
            });
        } else {
          resolve(colors.bgRed("directorio vacio"));
        }
      } else {
        if (api.getMdFiles(path) !== "Directorio vacio") {
          api
            .getProp(path)
            .then((res) => {
              console.log(colors.bgBlue("Cargando links"));
              api.validater(res).then((val) => {
                resolve(val);
              });
            })
            .catch((err) => {
              resolve(err);
            });
        } else {
          resolve(colors.bgRed("directorio vacio"));
        }
      }
    }
  });
};

// --------------STATS---------------//
// Cantidad de links//
const statsTotal = (links) => {
  const linksTotal = links.length;
  return linksTotal;
};
// Cantidad de links rotos //
const bronkenStats = (links) => {
  const brokenLinks = links.filter((link) => link.message === "FAIL");
  return brokenLinks.length;
};
// Cantidad de links unicos //
const uniqueStats = (links) => {
  const uniqueLinks = [...new Set(links.map((link) => link.href))];
  return uniqueLinks.length;
};
// // PROBAREMOS SI FUNCIONA MD LINKS, TRUE PARA QUE HAGA LA PETICION HTTP Y FALSE PARA QUE SOLO DEVUELVA LOS LINKS
// const result = mdLinks("./src/direct", { validate: true });
// result
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = {
  mdLinks,
  statsTotal,
  uniqueStats,
  bronkenStats,
  colors
};
