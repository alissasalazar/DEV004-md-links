#!/usr/bin/env node
const process = require("node:process");

const {
  mdLinks,
  statsTotal,
  uniqueStats,
  bronkenStats,
  colors,
} = require("./index.js");

const path = process.argv[2];
let isValid = false;

// No se coloca path
if (process.argv[2] === undefined) {
  console.log("Por favor ingresar una ruta");
} else if (process.argv[3] === undefined) {
  mdLinks(path, { validate: false })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// No sabe que option colocar
if (process.argv[2] === "--help") {
  console.log(
    colors.bgYellow(
      "Puedes usar las opciones --validate, --stats o --validate--stats"
    )
  );
} else {
  isValid = process.argv[3] === "--validate";
  mdLinks(path, { validate: isValid })
    .then((res) => {
      if (
        (process.argv[4] === "--stats" && process.argv[3] === "--validate") || (process.argv[4] === "--validate" && process.argv[3] === "--stats")
      ) {
        console.log(`Total: ${statsTotal(res)}`);
        console.log(`Unique: ${uniqueStats(res)}`);
        console.log(`Broken: ${bronkenStats(res)}`);
      } else if (process.argv[3] === "--stats") {
        console.log(`Total: ${statsTotal(res)}`);
        console.log(`Unique: ${uniqueStats(res)}`);
      } else if (
        process.argv[3] === "--validate" && process.argv[4] === undefined
      ) {
        console.log(res);
      }
    })
    .catch((err) => console.log(err));
}
