import TeamSidebar from './TeamSidebar.jsx';

const team = [
  { id: 1, name: 'bulbasaur', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', types: ['grass', 'poison'] },
  { id: 4, name: 'charmander', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', types: ['fire'] },
  { id: 7, name: 'squirtle', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', types: ['water'] },
  { id: 25, name: 'pikachu', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', types: ['electric'] },
  { id: 39, name: 'jigglypuff', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png', types: ['fairy'] },
  { id: 94, name: 'gengar', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png', types: ['ghost', 'poison'] },
];

const meta = {
  title: 'Components/TeamSidebar',
  component: TeamSidebar,
  args: {
    team: [],
    onRemoveFromTeam: () => {},
  },
};

export default meta;

export const Empty = {};

export const PartiallyFilled = {
  args: {
    team: team.slice(0, 3),
  },
};

export const FullTeam = {
  args: {
    team,
  },
};
