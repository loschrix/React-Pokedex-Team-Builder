import { useCallback, useEffect, useState } from "react";

const INITIAL_URL = "https://pokeapi.co/api/v2/pokemon?limit=20";
const MAX_POKEMON = 151;

function mapPokemonData(rawData) {
    return {
        id: rawData.id,
        name: rawData.name,
        image: rawData.sprites.front_default,
        types: rawData.types.map(({ type }) => type.name)
    };
}

async function fetchPokemonDetails(pokemon) {
    const pokemonResponse = await fetch(pokemon.url);

    if (!pokemonResponse.ok) {
        throw new Error(`Error when loading: ${pokemon.name}`);
    }

    const rawData = await pokemonResponse.json();
    return mapPokemonData(rawData);
}

export function usePokemonData() {
    const [pokemons, setPokemons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nextUrl, setNextUrl] = useState(INITIAL_URL);

    const fetchPokemons = useCallback(async (url) => {
        if (!url) {
            return;
        }

        try {
            setError(null);
            setIsLoading(true);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const pokemonsData = await Promise.all(data.results.map(fetchPokemonDetails));

            let loadedCount = 0;

            setPokemons(previousPokemons => {
                const combinedPokemons = [...previousPokemons, ...pokemonsData]
                    .filter(({ id }) => id <= MAX_POKEMON);

                const uniquePokemons = Array.from(
                    new Map(combinedPokemons.map(pokemon => [pokemon.id, pokemon])).values()
                );

                const limitedPokemons = uniquePokemons.slice(0, MAX_POKEMON);
                loadedCount = limitedPokemons.length;
                return limitedPokemons;
            });

            setNextUrl(loadedCount >= MAX_POKEMON ? null : data.next);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unexpected error while loading Pokémon.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void fetchPokemons(INITIAL_URL);
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [fetchPokemons]);

    const loadMore = useCallback(() => {
        if (nextUrl && !isLoading) {
            void fetchPokemons(nextUrl);
        }
    }, [fetchPokemons, isLoading, nextUrl]);

    return { pokemons, isLoading, error, loadMore, hasMore: Boolean(nextUrl) };
}
