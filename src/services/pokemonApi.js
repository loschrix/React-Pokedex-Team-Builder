const ALL_KANTO_URL = "https://pokeapi.co/api/v2/pokemon?limit=151";

export async function fetchKantoList() {
    const response = await fetch(ALL_KANTO_URL);
    if (!response.ok) {
        throw new Error("Failed to fetch Kanto list.");
    }
    const data = await response.json();
    return data.results;
}

export async function fetchPokemonDetails(pokemonUrl) {
    const response = await fetch(pokemonUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch details from ${pokemonUrl}`);
    }

    const rawData = await response.json();

    return {
        id: rawData.id,
        name: rawData.name,
        image: rawData.sprites.front_default,
        types: rawData.types.map(({ type }) => type.name)
    };
}