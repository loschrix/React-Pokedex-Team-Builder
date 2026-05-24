import { fetchKantoList, fetchPokemonDetails } from '../pokemonApi.js';

describe('pokemonApi', () => {
  test('fetchKantoList returns results when request succeeds', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }] }),
    });

    await expect(fetchKantoList()).resolves.toEqual([
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    ]);
  });

  test('fetchKantoList throws when request fails', async () => {
    globalThis.fetch.mockResolvedValue({ ok: false });

    await expect(fetchKantoList()).rejects.toThrow('Failed to fetch Kanto list.');
  });

  test('fetchPokemonDetails maps the response shape', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 25,
        name: 'pikachu',
        sprites: { front_default: 'pikachu.png' },
        types: [{ type: { name: 'electric' } }],
      }),
    });

    await expect(fetchPokemonDetails('https://pokeapi.co/api/v2/pokemon/25/')).resolves.toEqual({
      id: 25,
      name: 'pikachu',
      image: 'pikachu.png',
      types: ['electric'],
    });
  });

  test('fetchPokemonDetails throws when request fails', async () => {
    const url = 'https://pokeapi.co/api/v2/pokemon/999/';
    globalThis.fetch.mockResolvedValue({ ok: false });

    await expect(fetchPokemonDetails(url)).rejects.toThrow(`Failed to fetch details from ${url}`);
  });
});
