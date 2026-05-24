import { useEffect, useState, useCallback } from "react";

export function usePokemonData() {
    const [pokemons, setPokemons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);
    const [nextUrl, setNextUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=20');

    const MAX_POKEMON = 151; // number of pokémon in first generation

    // function memoization with useCallback
    const fetchPokemons = useCallback(async (url) => {
        if (!url) return;

        try {
            setIsLoading(true);

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            // Pagination
            const pokemonsData = await Promise.all(
                data.results.map(async (pokemon) => {
                    const pokemonResponse = await fetch(pokemon.url);

                    if (!pokemonResponse.ok) throw new Error(`Error when loading: ${pokemon.name}`);

                    const rawData = await pokemonResponse.json();

                    return {
                        id: rawData.id,
                        name: rawData.name,
                        image: rawData.sprites.front_default,
                        types: rawData.types.map(t => t.type.name)
                    };
                })
            );

            // Update Pokémon list
            setPokemons(prevPokemons => {
                const combined = [...prevPokemons, ...pokemonsData];
                const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());

                setCount(unique.length);
                return unique.slice(0, MAX_POKEMON);
            });

            // Update next site's link
            if (count + pokemonsData.length >= MAX_POKEMON) {
                setNextUrl(null);
            } else {
                setNextUrl(data.next);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // First pack of data when mounting a component
    useEffect(() => {
        if (pokemons.length === 0) {
            void fetchPokemons('https://pokeapi.co/api/v2/pokemon?limit=20');
        }
    }, [fetchPokemons, pokemons.length]);

    // Allows for mounting next data
    const loadMore = useCallback(() => {
        if (nextUrl && !isLoading) {
            void fetchPokemons(nextUrl);
        }
    }, [nextUrl, isLoading, fetchPokemons]);

    return { pokemons, isLoading, error, loadMore, hasMore: !!nextUrl };
}