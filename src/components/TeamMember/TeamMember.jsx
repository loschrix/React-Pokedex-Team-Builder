import React from "react";
import "./TeamMember.css";

export function TeamMember({ pokemon, index, onRemove }) {
    const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const primaryType = pokemon.types[0] ?? "unknown";

    return (
        <button
            type="button"
            className={`team-slot team-slot--filled type-outline-${primaryType}`}
            onClick={() => onRemove(pokemon.id)}
        >
            <span className="team-slot__index">0{index + 1}</span>
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