export function TeamMember({ pokemon, index, onRemove }) {
    const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const primaryType = pokemon.types[0] ?? "unknown";
    const teamPosition = String(index + 1).padStart(2, "0");

    return (
        <button
            type="button"
            className={`team-slot team-slot--filled type-outline-${primaryType}`}
            onClick={() => onRemove(pokemon.id)}
        >
            <span className="team-slot__index">{teamPosition}</span>
            <img
                src={pokemon.image}
                alt={pokemon.name}
                className="team-slot__image"
            />
            <div>
                <strong>{capitalizedName}</strong>
                <p>{pokemon.types.join(" / ")}</p>
            </div>
        </button>
    );
}