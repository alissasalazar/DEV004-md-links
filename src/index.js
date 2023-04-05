const api = require('./api.js');

const mdLinks = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!api.existPath(path)) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('La ruta introducida no existe')
    } else {
      if (!options.validate) {
        const validGetProp = api.getMdFiles(path) !== "Directorio vacio"
          ? api.getProp(path)
          : "Directorio vacio";
        resolve(validGetProp);
      } else {
        const validValidater = api.getMdFiles(path) !== "Directorio vacio"
          ? api.validater(api.getProp(path))
          : "Directorio vacío";
        resolve(validValidater);
      }
    }
  });
};
// // PROBAREMOS SI FUNCIONA MD LINKS, TRUE PARA QUE HAGA LA PETICION HTTP Y FALSE PARA QUE SOLO DEVUELVA LOS LINKS 
const result = mdLinks("./src/example.md", { validate: false });
result
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
