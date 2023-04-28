#!/usr/bin/env node
const api = require("./api.js");
const {
  mdLinks,
  statsTotal,
  uniqueStats,
  bronkenStats,
  colors,
} = require("./index.js");

const proc = api.process;
// Se selecciona la ruta
const path = proc.argv[2];

// No se coloca path
if (proc.argv[2] === undefined) {
  console.log(colors.bgMagenta("Por favor ingresar una ruta y/o escribir '--help'"));
} else if (proc.argv[3] === undefined) {
  mdLinks(path, { validate: false })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// No sabe que option colocar
if (proc.argv[2] === "--help") {
  console.log(
    colors.bgYellow(
      `"Puedes usar las siguientes opciones para validar los links de tu(s) archivo(s):
      --validate: Revisa si tu link funciona o no, 
      --stats: Te dará la cantidad total de links y cantidad de links unicos,
      --validate--stats: Te dará la cantidad total de links,cantidad de links unicos y cantidad de links rotos"`
    )
  );
} else {
  mdLinks(path, { validate: true })
    .then((res) => {
      const total = `Total: ${statsTotal(res)}`;
      const unique = `Unique: ${uniqueStats(res)}`;
      const broken = `Broken: ${bronkenStats(res)}`;
      const option1 = proc.argv[4] === "--stats" && proc.argv[3] === "--validate";
      const option2 = proc.argv[4] === "--validate" && proc.argv[3] === "--stats";
      const option3 = proc.argv[3] === "--validate" && proc.argv[4] === undefined;
      
      if (option1 || option2) {
        console.log(`${total}\n${unique}\n${broken}`);
      } else if (proc.argv[3] === "--stats") {
        console.log(`${total}\n${unique}`);
      } else if (option3) {
        console.log(res);
      } else {
        console.log(colors.bgRed("Escribir una opcion para poder validar la ruta o revisar si se escribio correctamente la opcion"))
      }
    })
    .catch((err) => console.log(err));
}
