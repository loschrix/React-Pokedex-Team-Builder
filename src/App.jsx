import { useCallback, useMemo, useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Searchbar from "./components/Searchbar/Searchbar.jsx";
import { PokemonCard } from "./components/PokemonCard/PokemonCard.jsx";
import TeamSidebar from "./components/TeamSidebar/TeamSidebar.jsx";
import { PokedexStatus } from "./components/PokedexStatus/PokedexStatus.jsx";
import { useInfiniteScroll } from "./services/useInfiniteScroll.js";
import { usePokemonData } from "./services/usePokemonData.js";
import { useDebounce } from "./services/useDebounce.js";
import { useTeamStorage } from "./services/useTeamStorage.js";
import "./app.css";

function App() {
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearchValue = useDebounce(searchValue, 500);
    const { pokemons, isLoading, error, loadMore, hasMore } = usePokemonData(debouncedSearchValue);
    const [team, setTeam] = useTeamStorage();

    const loaderRef = useInfiniteScroll({
        onLoadMore: loadMore,
        hasMore,
        isLoading
    });

    const teamIds = useMemo(() => new Set(team.map(({ id }) => id)), [team]);

    const handleSearchChange = useCallback((value) => {
        setSearchValue(value);
    }, []);

    const handleAddToTeam = useCallback((pokemon) => {
        setTeam(currentTeam => {
            if (currentTeam.some(({ id }) => id === pokemon.id)) return currentTeam;
            if (currentTeam.length >= 6) return currentTeam;
            return [...currentTeam, pokemon];
        });
    }, [setTeam]);

    const handleRemoveFromTeam = useCallback((pokemonId) => {
        setTeam(currentTeam => currentTeam.filter(({ id }) => id !== pokemonId));
    }, [setTeam]);

    const hasActiveSearch = useMemo(
        () => debouncedSearchValue.trim().length > 0,
        [debouncedSearchValue]
    );

    return (
        <div className="app-shell">
            <Navbar />

            <main className="main-layout">
                <section className="pokedex-column">
                    <div className="column-header">
                        <div>
                            <p className="eyebrow">KANTO POKEDEX</p>
                        </div>
                    </div>

                    <Searchbar value={searchValue} onChange={handleSearchChange} />

                    {error && <p className="status-banner status-banner--error">Error when loading: {error}</p>}

                    <div className="scrollable-content custom-scrollbar">
                        <div className="pokedex-grid">
                            {pokemons.map(pokemon => (
                                <PokemonCard
                                    key={pokemon.id}
                                    pokemon={pokemon}
                                    isSelected={teamIds.has(pokemon.id)}
                                    isTeamFull={team.length >= 6}
                                    onAddToTeam={handleAddToTeam}
                                />
                            ))}
                        </div>

                        {!isLoading && pokemons.length === 0 && (
                            <div className="empty-state">
                                <h3>No Pokémon matched your search.</h3>
                                <p>Try to type something else.</p>
                            </div>
                        )}

                        <div className="pagination" ref={loaderRef} />
                        <PokedexStatus
                            isLoading={isLoading}
                            hasMore={hasMore}
                            hasActiveSearch={hasActiveSearch}
                            hasResults={pokemons.length > 0}
                        />
                    </div>
                </section>

                <TeamSidebar
                    team={team}
                    onRemoveFromTeam={handleRemoveFromTeam}
                />
            </main>
        </div>
    );
}

export default App;