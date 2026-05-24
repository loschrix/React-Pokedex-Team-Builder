import Navbar from "./components/Navbar/Navbar.jsx";
import Searchbar from "./components/Searchbar/Searchbar.jsx";
import { usePokemonData } from "./services/usePokemonData.js";
import { PokemonCard } from "./components/PokemonCard/PokemonCard.jsx";
import { useInfiniteScroll } from "./services/useInfiniteScroll.js";
import "./app.css";

function App() {
    const { pokemons, isLoading, error, loadMore, hasMore } = usePokemonData();

    const loaderRef = useInfiniteScroll({
        onLoadMore: loadMore,
        hasMore: hasMore,
        isLoading: isLoading
    });

    return (
        <div className="app-shell">
            <Navbar />
            <main className="main-layout">

                {/* Lewa kolumna: 70% */}
                <section className="pokedex-column">
                    <Searchbar />

                    {error && <p>Błąd: {error}</p>}

                    {/* NOWY KONTENER: Odpowiada za scrollowanie całości (siatka + loader) */}
                    <div className="scrollable-content">

                        {/* Wrzucamy wygenerowane karty do siatki */}
                        <div className="pokedex-grid">
                            {pokemons.map(pokemon => (
                                <PokemonCard key={pokemon.id} pokemon={pokemon} />
                            ))}
                        </div>

                        {/* Sekcja ładowania na samym dole przewijanego obszaru */}
                        <div className="pagination" ref={loaderRef} style={{ minHeight: '50px', textAlign: 'center', padding: '1rem 0' }}>
                            {!hasMore && !isLoading && <p>You've catch all Pokemon!</p>}
                        </div>

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