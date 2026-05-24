import { PokemonCard } from './PokemonCard.jsx';

const pokemon = {
  id: 25,
  name: 'pikachu',
  image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  types: ['electric'],
};

const meta = {
  title: 'Components/PokemonCard',
  component: PokemonCard,
  args: {
    pokemon,
    isSelected: false,
    isTeamFull: false,
    onAddToTeam: () => {},
  },
};

export default meta;

export const Default = {};

export const Selected = {
  args: {
    isSelected: true,
  },
};

export const TeamFull = {
  args: {
    isTeamFull: true,
  },
};
