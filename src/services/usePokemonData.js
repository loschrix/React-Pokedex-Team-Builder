import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { fetchKantoList, fetchPokemonDetails } from "./pokemonApi.js";

const PAGE_SIZE = 20;

function paginationReducer(state, action) {
    switch (action.type) {
        case "reset":
            return { page: 0, pokemons: [] };
        case "appendPage": {
            const combined = action.page === 0
                ? action.payload
                : [...state.pokemons, ...action.payload];

            return {
                page: state.page,
                pokemons: Array.from(new Map(combined.map(pokemon => [pokemon.id, pokemon])).values())
            };
        }
        case "nextPage":
            return { ...state, page: state.page + 1 };
        default:
            return state;
    }
}

export function usePokemonData(searchQuery = "") {
    const [basePokemons, setBasePokemons] = useState([]);
    const [{ page, pokemons }, dispatch] = useReducer(paginationReducer, { page: 0, pokemons: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadInitialData() {
            try {
                const results = await fetchKantoList();
                if (isMounted) setBasePokemons(results);
            } catch (err) {
                if (isMounted) setError(err.message);
            }
        }

        loadInitialData();

        return () => { isMounted = false; };
    }, []);

    const filteredBasePokemons = useMemo(() => {
        if (!searchQuery) return basePokemons;

        const normalizedQuery = searchQuery.toLowerCase().trim();

        return basePokemons.filter(p => {
            const id = p.url.split("/").filter(Boolean).pop();
            return p.name.includes(normalizedQuery) ||
                id === normalizedQuery ||
                id === String(parseInt(normalizedQuery, 10));
        });
    }, [basePokemons, searchQuery]);

    useEffect(() => {
        dispatch({ type: "reset" });
    }, [filteredBasePokemons]);

    useEffect(() => {
        if (filteredBasePokemons.length === 0) return;

        let isMounted = true;

        async function loadPageDetails() {
            setIsLoading(true);
            setError(null);

            try {
                const startIndex = page * PAGE_SIZE;
                const endIndex = startIndex + PAGE_SIZE;
                const sliceToLoad = filteredBasePokemons.slice(startIndex, endIndex);

                if (sliceToLoad.length === 0) {
                    if (isMounted) setIsLoading(false);
                    return;
                }

                const details = await Promise.all(sliceToLoad.map(p => fetchPokemonDetails(p.url)));

                if (isMounted) {
                    dispatch({ type: "appendPage", page, payload: details });
                }
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadPageDetails();

        return () => { isMounted = false; };
    }, [page, filteredBasePokemons]);

    const loadMore = useCallback(() => {
        if (!isLoading && pokemons.length < filteredBasePokemons.length) {
            dispatch({ type: "nextPage" });
        }
    }, [isLoading, pokemons.length, filteredBasePokemons.length]);

    const hasMore = pokemons.length < filteredBasePokemons.length;

    return { pokemons, isLoading, error, loadMore, hasMore };
}