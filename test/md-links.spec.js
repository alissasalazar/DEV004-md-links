import { mdLinks } from "./index.js";
import { api } from "./api.js";

describe('mdLinks', () => {
  it('should...', () => {
    console.log('FIX ME!');
  });
  it('Deberia volver una promesa', () => {
    expect(mdLinks()).toBe(typeof Promise)
  });
});

describe('path_exists', () => {
  it('Debería validar si la ruta existe', () => {
    expect(api.path_exists('src/new_directory/cheat.txt')).toBeTruthy()
    expect(api.path_exists('src/fake_directory/cheat.txt')).not.toBeTruthy()
  });
});
