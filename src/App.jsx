import Navbar from "./components/Navbar/Navbar.jsx";
import Searchbar from "./components/Searchbar/Searchbar.jsx";
import "./app.css";
import PokedexGrid from "./components/PokedexGrid/PokedexGrid.jsx";

function App() {

  return (
    <>
        <Navbar></Navbar>
        <main className="main-layout">

            {/* Lewa kolumna: 70% */}
            <section className="pokedex-column">
                <Searchbar></Searchbar>
                <PokedexGrid></PokedexGrid>
            </section>

            {/* Prawa kolumna: 30% */}
            <aside className="team-column">
                {/* Tutaj będzie kontener "Twoja Drużyna (6/6)" */}
            </aside>

        </main>
    </>
  )
}

export default App
