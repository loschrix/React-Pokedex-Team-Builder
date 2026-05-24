import { useEffect, useState, useCallback } from "react";

export function usePokemonData() {
    const [pokemons, setPokemons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nextUrl, setNextUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=20');

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
                return Array.from(new Map(combined.map(p => [p.id, p])).values());
            });

            // Update next site's link
            setNextUrl(data.next);

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
    const loadMore = () => {
        if (nextUrl && !isLoading) {
            void fetchPokemons(nextUrl);
        }
    };

    return { pokemons, isLoading, error, loadMore, hasMore: !!nextUrl };
}