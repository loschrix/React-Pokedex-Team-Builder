import { renderHook, act } from '@testing-library/react';
import { useTeamStorage } from '../useTeamStorage.js';

describe('useTeamStorage', () => {
  test('reads initial state from pokemonTeam localStorage key', () => {
    localStorage.setItem('pokemonTeam', JSON.stringify([{ id: 1, name: 'bulbasaur', types: ['grass'] }]));

    const { result } = renderHook(() => useTeamStorage());

    expect(result.current[0]).toEqual([{ id: 1, name: 'bulbasaur', types: ['grass'] }]);
  });

  test('falls back to empty array when storage has invalid JSON', () => {
    localStorage.setItem('pokemonTeam', '{not-json');

    const { result } = renderHook(() => useTeamStorage());

    expect(result.current[0]).toEqual([]);
  });

  test('writes team changes back to localStorage', () => {
    const { result } = renderHook(() => useTeamStorage());

    act(() => {
      result.current[1]([{ id: 25, name: 'pikachu', types: ['electric'] }]);
    });

    expect(localStorage.getItem('pokemonTeam')).toBe(
      JSON.stringify([{ id: 25, name: 'pikachu', types: ['electric'] }])
    );
  });
});
