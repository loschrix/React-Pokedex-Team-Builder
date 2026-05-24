import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../App.jsx';
import { fetchKantoList, fetchPokemonDetails } from '../services/pokemonApi.js';

jest.mock('../services/pokemonApi.js', () => ({
  fetchKantoList: jest.fn(),
  fetchPokemonDetails: jest.fn(),
}));

function createBasePokemon(id, name) {
  return { name, url: `https://pokeapi.co/api/v2/pokemon/${id}/` };
}

function createPokemon(id, name, types = ['normal']) {
  return { id, name, image: `${name}.png`, types };
}

function mockPokemonApi(pokemons) {
  const byId = new Map(pokemons.map((pokemon) => [pokemon.id, pokemon]));

  fetchKantoList.mockResolvedValue(
    pokemons.map((pokemon) => createBasePokemon(pokemon.id, pokemon.name))
  );

  fetchPokemonDetails.mockImplementation(async (url) => {
    const id = Number(url.split('/').filter(Boolean).pop());
    const pokemon = byId.get(id);

    if (!pokemon) {
      throw new Error(`Missing pokemon ${id}`);
    }

    return pokemon;
  });
}

describe('App integration', () => {
  test('renders loaded pokedex cards', async () => {
    mockPokemonApi([
      createPokemon(1, 'bulbasaur', ['grass']),
      createPokemon(25, 'pikachu', ['electric']),
    ]);

    render(<App />);

    expect(await screen.findByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });

  test('filters results through debounced search', async () => {
    jest.useFakeTimers();
    mockPokemonApi([
      createPokemon(1, 'bulbasaur', ['grass']),
      createPokemon(4, 'charmander', ['fire']),
      createPokemon(25, 'pikachu', ['electric']),
    ]);

    render(<App />);

    await screen.findByText('Bulbasaur');

    fireEvent.change(screen.getByPlaceholderText('Try Pikachu, 025...'), {
      target: { value: 'char' },
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.getByText('Charmander')).toBeInTheDocument();
      expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument();
    });
  });

  test('supports add/remove flow and enforces six-member team cap', async () => {
    mockPokemonApi([
      createPokemon(1, 'poke1'),
      createPokemon(2, 'poke2'),
      createPokemon(3, 'poke3'),
      createPokemon(4, 'poke4'),
      createPokemon(5, 'poke5'),
      createPokemon(6, 'poke6'),
      createPokemon(7, 'poke7'),
    ]);

    render(<App />);

    await screen.findByText('Poke1');

    const addButtons = screen.getAllByLabelText('Add to team');
    for (const button of addButtons.slice(0, 6)) {
      fireEvent.click(button);
    }

    expect(screen.getByText('6/6')).toBeInTheDocument();
    expect(screen.getByLabelText('Already in team')).toBeDisabled();
    expect(screen.getByLabelText('Team full')).toBeDisabled();

    const member = screen.getByText('Poke1').closest('button');
    fireEvent.click(member);

    expect(await screen.findByText('5/6')).toBeInTheDocument();
  });

  test('shows empty state when no pokemon match search', async () => {
    jest.useFakeTimers();
    mockPokemonApi([
      createPokemon(1, 'bulbasaur', ['grass']),
      createPokemon(25, 'pikachu', ['electric']),
    ]);

    render(<App />);

    await screen.findByText('Bulbasaur');

    fireEvent.change(screen.getByPlaceholderText('Try Pikachu, 025...'), {
      target: { value: 'zzzzz' },
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(await screen.findByText('No Pokémon matched your search.')).toBeInTheDocument();
  });

  test('renders error banner when data request fails', async () => {
    fetchKantoList.mockRejectedValue(new Error('network failure'));

    render(<App />);

    expect(await screen.findByText('Error when loading: network failure')).toBeInTheDocument();
  });

  test('restores team from localStorage on first render', async () => {
    localStorage.setItem(
      'pokemonTeam',
      JSON.stringify([createPokemon(150, 'mewtwo', ['psychic'])])
    );

    mockPokemonApi([createPokemon(1, 'bulbasaur', ['grass'])]);

    render(<App />);

    await screen.findByText('Bulbasaur');

    expect(screen.getByText('1/6')).toBeInTheDocument();
    expect(screen.getByText('Mewtwo')).toBeInTheDocument();
  });
});
