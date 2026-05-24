import { useEffect, useState } from "react";

function usePokemonData() {
    const [pokemon, setPokemon] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchGeneration() {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/generation/1/');

                if (!response.ok) {
                    throw new Error (`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const pokemonsData = await Promise.all(
                    data.pokemon_species.map(async (pokemon) => {
                        const urlParts = pokemon.url.split('/');
                        const id = urlParts[urlParts.length - 2];

                        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

                        if (!pokemonResponse.ok) {
                            throw new Error (`Error when getting data for pokemon with id: ${id}`);
                        }

                        const rawPokemonData = await pokemonResponse.json();

                        return {
                            id: rawPokemonData.id,
                            name: rawPokemonData.name,
                            image: rawPokemonData.sprites.front_default,
                            types: rawPokemonData.types.map(t => t.type.name)
                        }
                    })
                )

                setPokemon(pokemonsData);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchGeneration();
    }, []);

    if (isLoading) return <div>Loading data...</div>;
    if (error) return <div>There has been an error: {error}</div>;
}