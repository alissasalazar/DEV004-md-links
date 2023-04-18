const api = require("../src/api.js");
const index = require("../src/index.js");

describe("existFile", () => {
  it("Debería validar si la ruta existe", () => {
    expect(api.existFile("src/example.md")).toBeTruthy();
    expect(api.existFile("src/fake_directory/cheat.txt")).not.toBeTruthy();
  });
});

describe("isAbs", () => {
  it("Debería validar si la ruta es Absoluta", () => {
    expect(api.isAbs("src/example.md")).not.toBeTruthy();
  });
});

describe("changeRoute", () => {
  it("Debería cambiar una ruta relativa a una ruta absoluta", () => {
    const pathAbs =
      "C:\\Users\\pc\\Desktop\\PROGRAMACION\\PROYECTO-MD-LINKS\\DEV004-md-links\\src\\example.md";
    expect(api.changeRoute("./src/example.md")).toBe(pathAbs);
  });
});

// Se coloca el return para que Jest espere que se resuelva la promesa
describe("readArch", () => {
  it("Debería leer el archivo", () => {
    const apiReadArch = api.readArch("./src/example2.md");
    return apiReadArch.then((res) => {
      expect(res).toBe("hola chicas!");
    });
  });
  it("Debería darnos un error", () => {
    const apiReadArch = api.readArch("./src/example34.md");
    return apiReadArch.catch((err) => {
      expect(err).toBe(index.colors.bgRed("No se puede leer el archivo"));
    });
  });
});

describe("readDir", () => {
  it("Debería leer un Directorio", () => {
    const apiReadDir = api.readDir("./src/directorio");
    const filesFind = ["example3.md", "example4.txt", "example5.md"];
    const filesMd = ["example3.md", "example5.md"];
    expect(typeof apiReadDir).toBe("object");
    expect(apiReadDir).toEqual(filesFind);
    expect(apiReadDir).toEqual(expect.arrayContaining(filesMd));
  });
});

describe("hasExt", () => {
  it("Debería obtener las extension del archivo", () => {
    const apihasExt = api.hasExt("./src/directorio");
    expect(typeof apihasExt).toBe("boolean");
  });
  it("Debería obtener las extensiones archivos", () => {
    const apihasExt = api.hasExt("./src/directorio");
    const apihasExt2 = api.hasExt("./src/example2.md");
    const apihasExt3 = api.hasExt("./src/directorio/prueba.txt");
    expect(apihasExt).toBeFalsy();
    expect(apihasExt2).toBe(".md");
    expect(apihasExt3).toBe(".txt");
  });
});

describe("getMdFiles", () => {
  it("Debería devolvernos un archivo .md", () => {
    const respuesta = [
      "C:\\Users\\pc\\Desktop\\PROGRAMACION\\PROYECTO-MD-LINKS\\DEV004-md-links\\src\\directorio\\example3.md",
    ];
    const result = api.getMdFiles("./src/directorio/example3.md");
    expect(result).toStrictEqual(respuesta);
  });

  it("Debería decirnos que no es un archivo markdown", () => {
    const result = api.getMdFiles("./src/directorio/example4.txt");
    expect(result).toStrictEqual("No es un archivo markdown");
  });

  it("Debería devolvernos 'Directorio vacio' ", () => {
    const result = api.getMdFiles("vacio");
    expect(result).toStrictEqual("Directorio vacio");
  });

  it("Debería devolvernos archivos .md del directorio", () => {
    const respuesta = [
      "C:\\Users\\pc\\Desktop\\PROGRAMACION\\PROYECTO-MD-LINKS\\DEV004-md-links\\src\\directorio\\example3.md",
      "No es un archivo markdown",
      "C:\\Users\\pc\\Desktop\\PROGRAMACION\\PROYECTO-MD-LINKS\\DEV004-md-links\\src\\directorio\\example5.md",
    ];
    const result = api.getMdFiles("./src/directorio");
    expect(result).toStrictEqual(respuesta);
  });

  it("Debería decirnos que No se encontro la ruta indicada", () => {
    const result = api.getMdFiles("./src/directorio/exampled4.txt");
    expect(result).toStrictEqual("No se encontro la ruta indicada.Por favor revisar");
  });
});

describe("justMdFiles", () => {
  it("Debe filtrar solo los archivos markdown", () => {
    const result = api.justMdFiles("./src/directorio/example3.md");
    const rest = [
      "C:\\Users\\pc\\Desktop\\PROGRAMACION\\PROYECTO-MD-LINKS\\DEV004-md-links\\src\\directorio\\example3.md",
    ];
    expect(result).toStrictEqual(rest);
  });
});

// describe("arrayPromises", () => {
//   it("Deberia devolver un array de promesas", () => {
//     const result = api.arrayPromises("./src/directorio");
//     const rest = [ Promise {} ]
//     expect(result.).toBe(rest);
//   });
// });

describe("getPropertiesFiles", () => {
  it("Deberia devolver las propiedades de los links que tiene el archivo", () => {
    const getProp = api.getPropertiesFiles("./src/example.md");
    const rest = [
      {
        href: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort",
        text: "Array.prototype.sort() - MDN",
        file: "./src/example.md",
        lines: [
          "* [Array.prototype.sort() - MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)\r",
          "  ",
        ],
      },
    ];
    return getProp.then((res) => {
      expect(res).toStrictEqual(rest);
    });
  });

  it("Devolver que el archivo no contiene links para validar", () => {
    const getProp = api.getPropertiesFiles("./src/example2.md");
    const rest = [
      {
        href: "Los archivos no contienen Links para validar",
        text: "",
        file: "./src/example2.md",
      },
    ];
    return getProp.then((res) => {
      expect(res).toStrictEqual(rest);
    });
  });
});

describe("validater", () => {
  it("Debería validar que el link funciona ", () => {
    const result = [
      {
        href: "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort",
        text: "Array.prototype.sort() - MDN",
        file: "./src/example.md",
        status: 200,
        lines: [1],
        message: "OK",
      },
    ];
    return api.getPropertiesFiles("./src/example.md").then((res) => {
      console.log(index.colors.bgBlue("Cargando links"));
      api.validater(res).then((val) => {
        expect(val).toStrictEqual(result);
      });
    });
  });

  it("Debería validar si el link no funciona ", () => {
    const result = [
      {
        href: 'https://nodejs.org/api/fs',
        text: 'File system - Documentación oficial (en inglés)',
        file: './src/direct/ex.md',
        status: 'Fail Request failed with status code 404',
        lines: [1],
        message: 'FAIL'
      },
    ];
    return api.getPropertiesFiles("./src/direct/ex.md").then((res) => {
      return api.validater(res).then((val) => {
        expect(val).toStrictEqual(result);
      });
    });
  });
});

// describe( , () => {
//   it( , () => { expect().toBe()});
// });

describe("MD-Links", () => {
  it("Debería mostrar el error de una ruta que no existe", () => { 
    const mdL = index.mdLinks("./src/vacfio", { validate: false });
    const resultado = index.colors.bgRed("No se encontro la ruta indicada.Por favor revisar");
    return mdL.catch((res) => {
      expect(res).toStrictEqual(resultado)
    })
  });

  it("Debería hacer uso de md links sin petición HTTP, usando false", () => { 
    const mdL = index.mdLinks("./src/example.md", { validate: false });
    const resultado = [
      {
        href: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort',
        text: 'Array.prototype.sort() - MDN',
        file: './src/example.md',
        lines: [
          '* [Array.prototype.sort() - MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)\r',
          '  '
        ]
      }
    ]
    return mdL.then((res) => {
      expect(res).toStrictEqual(resultado)
    })
  });

  it("Debería hacer una peticion en HTTP con true", () => { 
    const mdL = index.mdLinks("./src/example.md", { validate: true });
    const resultado = [
      {
        href: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort',
        text: 'Array.prototype.sort() - MDN',
        file: './src/example.md',
        status: 200,
        lines: [1],
        message: 'OK'
      }
    ]
    return mdL.then((res) => {
      expect(res).toStrictEqual(resultado)
    })
  });

  it("Debería mostrarnos que sucede si dejamos vacio options", () => { 
    const mdL = index.mdLinks("./src/example.md", { });
    const resultado = [
      {
        href: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort',
        text: 'Array.prototype.sort() - MDN',
        file: './src/example.md',
        lines: [
          '* [Array.prototype.sort() - MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)\r',
          '  '
        ]
      }
    ]
    return mdL.then((res) => {
      expect(res).toStrictEqual(resultado)
    })
  });

  it("Debería mostrarnos que no existe el archivo", () => { 
    const mdL = index.mdLinks("./src/vacio", { validate: true });
    const resultado = index.colors.bgRed("No se encontro la ruta indicada.Por favor revisar");
    return mdL.catch((res) => {
      expect(res).toStrictEqual(resultado)
    })
  });
});

describe("statsTotal", () => {
  it("Cantidad de links", () => { 
    const link = [
      {
        href: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort',
        text: 'Array.prototype.sort() - MDN',
        file: './src/example.md',
        lines: [
          '* [Array.prototype.sort() - MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)\r',
          '  '
        ]
      }
    ]
    const stats = index.statsTotal(link)
    expect(stats).toBe(1) 
  });
});

// describe( , () => {
//   it( , () => { expect().toBe()});
// });

describe("bronkenStats", () => {
  it("Debería decirnos cuantos links estan rotos", () => { 
    const link = [
      {
        href: 'http://community.laboratoria.la/t/modulos-librerias-paquetes-frameworks-cual-es-la-diferencia/175',
        text: 'Módulos, librerías, paquetes, frameworks... ¿cuál ',
        file: 'readme.md',
        status: 'Fail getaddrinfo ENOTFOUND community.laboratoria.la',
        lines: [509],
        message: 'FAIL'
      },
      {
        href: 'https://carlosazaustre.es/manejando-la-asincronia-en-javascript',
        text: 'Asíncronía en js',
        file: 'readme.md',
        status: 200,
        lines: [510],
        message: 'OK'
      },
    ]
    const bronkenStats = index.bronkenStats(link)
    expect(bronkenStats).toBe(1) 
  });
});

describe("uniqueStats", () => {
  it("Debería decirnos cuantos links unicos hay", () => { 
    const link = [
      {
        href: 'http://community.laboratoria.la/t/modulos-librerias-paquetes-frameworks-cual-es-la-diferencia/175',
        text: 'Módulos, librerías, paquetes, frameworks... ¿cuál ',
        file: 'readme.md',
        status: 'Fail getaddrinfo ENOTFOUND community.laboratoria.la',
        lines: [509],
        message: 'FAIL'
      },
      {
        href: 'https://carlosazaustre.es/manejando-la-asincronia-en-javascript',
        text: 'Asíncronía en js',
        file: 'readme.md',
        status: 200,
        lines: [510],
        message: 'OK'
      },
      {
        href: 'http://community.laboratoria.la/t/modulos-librerias-paquetes-frameworks-cual-es-la-diferencia/175',
        text: 'Módulos, librerías, paquetes, frameworks... ¿cuál ',
        file: 'readme.md',
        status: 'Fail getaddrinfo ENOTFOUND community.laboratoria.la',
        lines: [509],
        message: 'FAIL'
      },
      {
        href: 'https://carlosazaustre.es/manejando-la-asincronia-en-javascript',
        text: 'Asíncronía en js',
        file: 'readme.md',
        status: 200,
        lines: [510],
        message: 'OK'
      },
    ]
    const bronkenStats = index.uniqueStats(link)
    expect(bronkenStats).toBe(2) 
  });
});
