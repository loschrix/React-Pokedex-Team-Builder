import "./PokemonCard.css";

export function PokemonCard({ pokemon, isSelected, isTeamFull, onToggleTeam }) {
    const formattedId = `#${pokemon.id.toString().padStart(3, "0")}`;
    const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const primaryType = pokemon.types[0] ?? "unknown";

    return (
        <article className={`pokemon-card type-theme-${primaryType} ${isSelected ? "pokemon-card--selected" : ""}`}>
            <div className="pokemon-card__header">
                <div className="pokemon-id">{formattedId}</div>
                <span className={`pokemon-primary-type type-${primaryType}`}>{primaryType}</span>
            </div>

            <img
                className="pokemon-image"
                src={pokemon.image}
                alt={pokemon.name}
            />

            <h2 className="pokemon-name">{capitalizedName}</h2>

            <div className="pokemon-types">
                {pokemon.types.map(type => (
                    <span key={type} className={`type-badge type-${type}`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                ))}
            </div>

            <button
                type="button"
                className="pokemon-add-button"
                onClick={() => onToggleTeam(pokemon)}
                disabled={isTeamFull && !isSelected}
            >
                {isSelected ? "Remove from team" : isTeamFull ? "Team full" : "Add to team"}
            </button>
        </article>
    );
}
