import { render, screen, fireEvent } from '@testing-library/react';
import { PokemonCard } from './PokemonCard.jsx';

const pokemon = {
  id: 25,
  name: 'pikachu',
  image: 'pikachu.png',
  types: ['electric'],
};

describe('PokemonCard', () => {
  test('renders formatted id, name, and type badge', () => {
    render(
      <PokemonCard
        pokemon={pokemon}
        isSelected={false}
        isTeamFull={false}
        onAddToTeam={jest.fn()}
      />
    );

    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
  });

  test('disables add button when selected or when team is full', () => {
    const { rerender } = render(
      <PokemonCard
        pokemon={pokemon}
        isSelected
        isTeamFull={false}
        onAddToTeam={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Already in team')).toBeDisabled();

    rerender(
      <PokemonCard
        pokemon={pokemon}
        isSelected={false}
        isTeamFull
        onAddToTeam={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Team full')).toBeDisabled();
  });

  test('calls onAddToTeam with pokemon payload', () => {
    const onAddToTeam = jest.fn();

    render(
      <PokemonCard
        pokemon={pokemon}
        isSelected={false}
        isTeamFull={false}
        onAddToTeam={onAddToTeam}
      />
    );

    fireEvent.click(screen.getByLabelText('Add to team'));

    expect(onAddToTeam).toHaveBeenCalledWith(pokemon);
  });
});
