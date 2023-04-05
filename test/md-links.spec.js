const api = require('../src/api.js');

describe('existPath', () => {
  it('Debería validar si la ruta existe', () => {
    expect(api.existPath('src/example.md')).toBeTruthy()
    expect(api.existPath('src/fake_directory/cheat.txt')).not.toBeTruthy()
  });
});

describe('isAbs', () => {
  it('Debería validar si la ruta es Absoluta', () => {
    expect(api.isAbs('src/example.md')).not.toBeTruthy()
  });
});

describe('changeRoute', () => {
  it('Debería cambiar una ruta relativa a una ruta absoluta', () => {
    const pathAbs = 'C:\\Users\\pc\\Desktop\\PROGRAMACION\\PROYECTO-MD-LINKS\\DEV004-md-links\\src\\example.md'
    expect(api.changeRoute('./src/example.md')).toBe(pathAbs)
  });
});

describe('readArch', () => {
  it('Debería leer un archivo ', () => {
    const apiReadArch = api.readArch('./src/example2.md')
    expect(typeof apiReadArch).toBe('string')
    expect(apiReadArch).toBe('hola chicas!')
  });
});

describe('readDir', () => {
  it('Debería leer un Directorio', () => {
    const apiReadDir = api.readDir('./src/directorio')
    const filesFind = ['example3.md', 'example4.txt', 'example5.md']
    const filesMd = ['example3.md', 'example5.md']
    expect(typeof apiReadDir).toBe('object')
    expect(apiReadDir).toEqual(filesFind)
    expect(apiReadDir).toEqual(expect.arrayContaining(filesMd))
  });
});
