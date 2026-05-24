# Pokémon Team Builder

A React web application for browsing the Kanto Pokédex and assembling a team of up to 6 Pokémon. Data is fetched live from the [PokéAPI](https://pokeapi.co/) and your team is automatically saved in your browser.

## Features

- **Browse the Kanto Pokédex** — scroll through all 151 Generation I Pokémon with infinite scroll (20 at a time)
- **Search** — filter Pokémon instantly by name or Pokédex number (debounced to avoid unnecessary API calls)
- **Type-themed cards** — each card is colour-coded to the Pokémon's primary type
- **Team builder sidebar** — add up to 6 Pokémon and remove them at any time
- **Persistent team** — your team is saved to `localStorage` so it survives page refreshes

## Tech Stack

| Layer | Technology |
|---|---|
| UI library | React 19 |
| Build tool | Vite 8 |
| Data source | PokéAPI (REST) |
| Linter | ESLint 10 |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (ships with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/loschrix/Pokemon-Build-Team-React.git
cd Pokemon-Build-Team-React

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the whole project |

## Project Structure

```
src/
├── components/
│   ├── Navbar/          # Top navigation bar
│   ├── Searchbar/       # Debounced search input
│   ├── PokemonCard/     # Individual Pokémon card with type theming
│   ├── TeamMember/      # Compact team slot in the sidebar
│   ├── TeamSidebar/     # Right-hand team panel (max 6 members)
│   └── PokedexStatus/   # Loading / end-of-list indicator
└── services/
    ├── pokemonApi.js       # PokeAPI fetch helpers
    ├── usePokemonData.js   # Pagination + search state management
    ├── useTeamStorage.js   # localStorage persistence for the team
    ├── useInfiniteScroll.js# IntersectionObserver-based infinite scroll
    └── useDebounce.js      # Generic debounce hook
```

## How It Works

1. On load, the app fetches the list of the first 151 Pokémon from PokéAPI.
2. Cards are loaded in pages of 20 using an `IntersectionObserver`; scrolling to the bottom automatically loads the next page.
3. Typing in the search bar filters the list client-side (by name or Pokédex number); the debounce hook waits 500 ms before applying the filter.
4. Clicking **+** on a card adds it to the team (maximum 6). The team is written to `localStorage` on every change.

## Contributing

Contributions are welcome! Please:

1. Fork the repository and create a feature branch.
2. Run `npm run lint` and `npm run build` before opening a pull request to make sure there are no errors.
3. Keep pull requests focused — one feature or fix per PR.

## Getting Help

- **PokéAPI docs**: [https://pokeapi.co/docs/v2](https://pokeapi.co/docs/v2)
- **Vite docs**: [https://vite.dev/](https://vite.dev/)
- **React docs**: [https://react.dev/](https://react.dev/)
- **Issues**: open a ticket in the [GitHub Issues](../../issues) tab
