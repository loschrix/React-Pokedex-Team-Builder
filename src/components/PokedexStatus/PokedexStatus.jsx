export function PokedexStatus({ isLoading, hasMore, hasActiveSearch, hasResults }) {
    if (isLoading || hasMore || hasActiveSearch || !hasResults) {
        return null;
    }

    return (
        <p className="pokedex-end-message">
            You reached the end of the full Kanto list.
        </p>
    );
}
