import { useCallback, useMemo, useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Searchbar from "./components/Searchbar/Searchbar.jsx";
import { PokemonCard } from "./components/PokemonCard/PokemonCard.jsx";
import { useInfiniteScroll } from "./services/useInfiniteScroll.js";
import { usePokemonData } from "./services/usePokemonData.js";
import "./app.css";

function App() {
    const { pokemons, isLoading, error, loadMore, hasMore } = usePokemonData();
    const [searchValue, setSearchValue] = useState("");
    const [team, setTeam] = useState([]);

    const loaderRef = useInfiniteScroll({
        onLoadMore: loadMore,
        hasMore,
        isLoading
    });

    const normalizedQuery = searchValue.trim().toLowerCase();

    const filteredPokemons = useMemo(() => {
        if (!normalizedQuery) {
            return pokemons;
        }

        return pokemons.filter(({ id, name, types }) => {
            const searchableValues = [name, id.toString(), ...types];
            return searchableValues.some(value => value.toLowerCase().includes(normalizedQuery));
        });
    }, [normalizedQuery, pokemons]);

    const teamIds = useMemo(() => new Set(team.map(({ id }) => id)), [team]);

    const featuredTypes = useMemo(() => {
        const typeCounts = filteredPokemons.reduce((counts, { types }) => {
            types.forEach(type => {
                counts[type] = (counts[type] ?? 0) + 1;
            });
            return counts;
        }, {});

        return Object.entries(typeCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 3);
    }, [filteredPokemons]);

    const handleSearchChange = useCallback((value) => {
        setSearchValue(value);
    }, []);

    const handleToggleTeam = useCallback((pokemon) => {
        setTeam(currentTeam => {
            const alreadySelected = currentTeam.some(({ id }) => id === pokemon.id);

            if (alreadySelected) {
                return currentTeam.filter(({ id }) => id !== pokemon.id);
            }

            if (currentTeam.length >= 6) {
                return currentTeam;
            }

            return [...currentTeam, pokemon];
        });
    }, []);

    return (
        <div className="app-shell">
            <Navbar />

            <main className="main-layout">
                <section className="pokedex-column">
                    <div className="column-header">
                        <div>
                            <p className="eyebrow">Kanto Pokédex</p>
                            <h2>Find the perfect squad for your next battle.</h2>
                            <p className="column-copy">
                                Browse the first 151 Pokémon, search by name or type, and lock in up to six picks for your dream roster.
                            </p>
                        </div>

                        <div className="header-stats" aria-label="Pokedex overview">
                            <div className="stat-card">
                                <span className="stat-label">Loaded</span>
                                <strong>{pokemons.length}</strong>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Matches</span>
                                <strong>{filteredPokemons.length}</strong>
                            </div>
                            <div className="stat-card stat-card--accent">
                                <span className="stat-label">Team</span>
                                <strong>{team.length}/6</strong>
                            </div>
                        </div>
                    </div>

                    <Searchbar value={searchValue} onChange={handleSearchChange} />

                    {error && <p className="status-banner status-banner--error">Błąd ładowania: {error}</p>}

                    <div className="scrollable-content">
                        {featuredTypes.length > 0 && (
                            <div className="type-overview">
                                <span className="type-overview__label">Popular types</span>
                                <div className="type-overview__chips">
                                    {featuredTypes.map(([type, count]) => (
                                        <span key={type} className={`type-overview__chip type-${type}`}>
                                            {type} · {count}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pokedex-grid">
                            {filteredPokemons.map(pokemon => (
                                <PokemonCard
                                    key={pokemon.id}
                                    pokemon={pokemon}
                                    isSelected={teamIds.has(pokemon.id)}
                                    isTeamFull={team.length >= 6}
                                    onToggleTeam={handleToggleTeam}
                                />
                            ))}
                        </div>

                        {!isLoading && filteredPokemons.length === 0 && (
                            <div className="empty-state">
                                <h3>No Pokémon matched your search.</h3>
                                <p>Spróbuj wpisać inny typ, numer albo fragment nazwy.</p>
                            </div>
                        )}

                        <div className="pagination" ref={loaderRef}>
                            {isLoading && <p className="status-banner">Loading more Pokémon…</p>}
                            {!hasMore && !isLoading && <p className="status-banner">You&apos;ve discovered all 151 Kanto Pokémon.</p>}
                        </div>
                    </div>
                </section>

                <aside className="team-column">
                    <div className="team-column__header">
                        <p className="eyebrow">Trainer Console</p>
                        <h2>Your battle-ready team</h2>
                        <p>
                            Pick up to six Pokémon. Mix types to keep your lineup versatile against every gym challenge.
                        </p>
                    </div>

                    <div className="team-summary">
                        <div>
                            <span className="team-summary__label">Slots used</span>
                            <strong>{team.length}/6</strong>
                        </div>
                        <div>
                            <span className="team-summary__label">Search</span>
                            <strong>{searchValue ? `“${searchValue}”` : "All"}</strong>
                        </div>
                    </div>

                    <div className="team-list">
                        {team.length === 0 ? (
                            Array.from({ length: 3 }, (_, index) => (
                                <div key={index} className="team-slot team-slot--empty">
                                    <span className="team-slot__index">0{index + 1}</span>
                                    <div>
                                        <strong>Open slot</strong>
                                        <p>Add a Pokémon from the left panel.</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            team.map((pokemon, index) => (
                                <button
                                    key={pokemon.id}
                                    type="button"
                                    className={`team-slot team-slot--filled type-outline-${pokemon.types[0] ?? "unknown"}`}
                                    onClick={() => handleToggleTeam(pokemon)}
                                >
                                    <span className="team-slot__index">0{index + 1}</span>
                                    <img src={pokemon.image} alt={pokemon.name} className="team-slot__image" />
                                    <div>
                                        <strong>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</strong>
                                        <p>{pokemon.types.join(" / ")}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </aside>
            </main>
        </div>
    );
}

export default App;
