import Navbar from "./components/Navbar/Navbar.jsx";
import Searchbar from "./components/Searchbar/Searchbar.jsx";
import { usePokemonData } from "./services/usePokemonData.js";
import { PokemonCard } from "./components/PokemonCard/PokemonCard.jsx";
import "./app.css";

function App() {
    // Pobieramy dane z naszego hooka
    const { pokemons, isLoading, error, loadMore, hasMore } = usePokemonData();

    return (
        <div className="app-shell">
            <Navbar />
            <main className="main-layout">

                {/* Lewa kolumna: 70% */}
                <section className="pokedex-column">
                    <Searchbar />

                    {error && <p>Błąd: {error}</p>}

                    {/* Wrzucamy wygenerowane karty do siatki */}
                    <div className="pokedex-grid">
                        {pokemons.map(pokemon => (
                            <PokemonCard key={pokemon.id} pokemon={pokemon} />
                        ))}
                    </div>

                    {/* Sekcja ładowania pod siatką */}
                    <div className="pagination">
                        {isLoading && <p>Loading Pokedex...</p>}
                        {!isLoading && hasMore && (
                            <button className="load-more-btn" onClick={loadMore}>
                                Załaduj więcej
                            </button>
                        )}
                    </div>
                </section>

                {/* Prawa kolumna: 30% */}
                <aside className="team-column">
                    {/* Tutaj będziemy dodawać wybrane Pokemony */}
                </aside>

            </main>
        </div>
    )
}

export default App;