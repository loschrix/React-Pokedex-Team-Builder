import { useCallback, useEffect, useState, useMemo } from "react";
import { fetchKantoList, fetchPokemonDetails } from "./pokemonApi.js"; // Importujemy serwis

const PAGE_SIZE = 20;

export function usePokemonData(searchQuery = "") {
    const [basePokemons, setBasePokemons] = useState([]);
    const [pokemons, setPokemons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);

    // ETAP 1: Pobranie zarysu listy
    useEffect(() => {
        let isMounted = true;

        async function loadInitialData() {
            try {
                // Wywołujemy czystą funkcję z serwisu
                const results = await fetchKantoList();
                if (isMounted) setBasePokemons(results);
            } catch (err) {
                if (isMounted) setError(err.message);
            }
        }

        loadInitialData();

        return () => { isMounted = false; };
    }, []);

    // ETAP 2: Filtrowanie
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

    // ETAP 3: Reset paginacji przy nowym wyszukiwaniu
    useEffect(() => {
        setPage(0);
        setPokemons([]);
    }, [filteredBasePokemons]);

    // ETAP 4: Paginacja i pobieranie szczegółów (Hydracja)
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

                // Ponownie korzystamy z czystej funkcji serwisu
                const details = await Promise.all(sliceToLoad.map(p => fetchPokemonDetails(p.url)));

                if (isMounted) {
                    setPokemons(prev => {
                        const combined = page === 0 ? details : [...prev, ...details];
                        return Array.from(new Map(combined.map(p => [p.id, p])).values());
                    });
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

    // ETAP 5: Ładowanie kolejnej strony
    const loadMore = useCallback(() => {
        if (!isLoading && pokemons.length < filteredBasePokemons.length) {
            setPage(prevPage => prevPage + 1);
        }
    }, [isLoading, pokemons.length, filteredBasePokemons.length]);

    const hasMore = pokemons.length < filteredBasePokemons.length;

    return { pokemons, isLoading, error, loadMore, hasMore };
}