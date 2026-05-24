import { renderHook, waitFor, act } from '@testing-library/react';
import { usePokemonData } from '../usePokemonData.js';
import { fetchKantoList, fetchPokemonDetails } from '../pokemonApi.js';

jest.mock('../pokemonApi.js', () => ({
  fetchKantoList: jest.fn(),
  fetchPokemonDetails: jest.fn(),
}));

function basePokemon(id, name = `pokemon-${id}`) {
  return { name, url: `https://pokeapi.co/api/v2/pokemon/${id}/` };
}

function detailedPokemon(id, name = `pokemon-${id}`) {
  return { id, name, image: `${name}.png`, types: ['normal'] };
}

describe('usePokemonData', () => {
  test('loads the first page of pokemon data', async () => {
    fetchKantoList.mockResolvedValue([basePokemon(1, 'bulbasaur'), basePokemon(25, 'pikachu')]);
    fetchPokemonDetails.mockImplementation(async (url) => {
      const id = Number(url.split('/').filter(Boolean).pop());
      return id === 1 ? detailedPokemon(1, 'bulbasaur') : detailedPokemon(25, 'pikachu');
    });

    const { result } = renderHook(() => usePokemonData(''));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.pokemons).toEqual([
      detailedPokemon(1, 'bulbasaur'),
      detailedPokemon(25, 'pikachu'),
    ]);
    expect(result.current.hasMore).toBe(false);
  });

  test('appends next page and deduplicates repeated ids', async () => {
    fetchKantoList.mockResolvedValue(Array.from({ length: 25 }, (_, index) => basePokemon(index + 1)));
    fetchPokemonDetails.mockImplementation(async (url) => {
      const id = Number(url.split('/').filter(Boolean).pop());
      return detailedPokemon(id === 21 ? 1 : id);
    });

    const { result } = renderHook(() => usePokemonData(''));

    await waitFor(() => expect(result.current.pokemons).toHaveLength(20));

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.pokemons).toHaveLength(24));

    const ids = result.current.pokemons.map((pokemon) => pokemon.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('filters by pokemon name and pokedex number', async () => {
    fetchKantoList.mockResolvedValue([
      basePokemon(1, 'bulbasaur'),
      basePokemon(4, 'charmander'),
      basePokemon(25, 'pikachu'),
    ]);
    fetchPokemonDetails.mockImplementation(async (url) => {
      const id = Number(url.split('/').filter(Boolean).pop());
      if (id === 1) return detailedPokemon(1, 'bulbasaur');
      if (id === 4) return detailedPokemon(4, 'charmander');
      return detailedPokemon(25, 'pikachu');
    });

    const { result, rerender } = renderHook(({ query }) => usePokemonData(query), {
      initialProps: { query: '' },
    });

    await waitFor(() => expect(result.current.pokemons).toHaveLength(3));

    rerender({ query: 'pika' });
    await waitFor(() => expect(result.current.pokemons).toEqual([detailedPokemon(25, 'pikachu')]));

    rerender({ query: '004' });
    await waitFor(() => expect(result.current.pokemons).toEqual([detailedPokemon(4, 'charmander')]));
  });

  test('sets error when initial list fetch fails', async () => {
    fetchKantoList.mockRejectedValue(new Error('network down'));

    const { result } = renderHook(() => usePokemonData(''));

    await waitFor(() => expect(result.current.error).toBe('network down'));
  });

  test('sets error when page detail fetch fails', async () => {
    fetchKantoList.mockResolvedValue([basePokemon(1, 'bulbasaur')]);
    fetchPokemonDetails.mockRejectedValue(new Error('details failed'));

    const { result } = renderHook(() => usePokemonData(''));

    await waitFor(() => expect(result.current.error).toBe('details failed'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  test('loadMore does nothing when no more items are available', async () => {
    fetchKantoList.mockResolvedValue([basePokemon(1, 'bulbasaur')]);
    fetchPokemonDetails.mockResolvedValue(detailedPokemon(1, 'bulbasaur'));

    const { result } = renderHook(() => usePokemonData(''));

    await waitFor(() => expect(result.current.pokemons).toHaveLength(1));
    expect(result.current.hasMore).toBe(false);

    act(() => {
      result.current.loadMore();
    });

    expect(fetchPokemonDetails).toHaveBeenCalledTimes(1);
  });
});
