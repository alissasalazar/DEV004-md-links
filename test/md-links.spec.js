const api = require("../src/api.js");
const {
  colors,
} = require("../src/index.js");

describe("existPath", () => {
  it("Debería validar si la ruta existe", () => {
    expect(api.existPath("src/example.md")).toBeTruthy();
    expect(api.existPath("src/fake_directory/cheat.txt")).not.toBeTruthy();
  });
});

describe("isAbs", () => {
  it("Debería validar si la ruta es Absoluta", () => {
    expect(api.isAbs("src/example.md")).not.toBeTruthy();
  });
});

describe("changeRoute", () => {
  it("Debería cambiar una ruta relativa a una ruta absoluta", () => {
    const pathAbs = "C:\\Users\\pc\\Desktop\\PROGRAMACION\\PROYECTO-MD-LINKS\\DEV004-md-links\\src\\example.md";
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
      expect(err).toBe(colors.bgRed("No se puede leer el archivo"));
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
    expect(typeof apihasExt).toBe("boolean")
  });
  it("Debería obtener las extensiones archivos", () => {
    const apihasExt = api.hasExt("./src/directorio");
    const apihasExt2 = api.hasExt("./src/example2.md")
    const apihasExt3 = api.hasExt("./src/directorio/prueba.txt")
    expect(apihasExt).toBeFalsy()
    expect(apihasExt2).toBe(".md")
    expect(apihasExt3).toBe(".txt")
  });
});
