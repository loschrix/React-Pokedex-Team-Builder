import React from 'react';
import './PokemonCard.css';

export function PokemonCard({ pokemon }) {
    const formattedId = `#${pokemon.id.toString().padStart(3, '0')}`;
    const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    return (
        <div className="pokemon-card">
            <div className="pokemon-id">{formattedId}</div>

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

            <div className="pokemon-add-button">
                +
            </div>
        </div>
    );
}