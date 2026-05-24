import { render, screen } from '@testing-library/react';
import TeamSidebar from './TeamSidebar.jsx';

const team = [
  { id: 1, name: 'bulbasaur', image: '1.png', types: ['grass'] },
  { id: 25, name: 'pikachu', image: '25.png', types: ['electric'] },
];

describe('TeamSidebar', () => {
  test('renders team count and team members', () => {
    render(<TeamSidebar team={team} onRemoveFromTeam={jest.fn()} />);

    expect(screen.getByText('2/6')).toBeInTheDocument();
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });
});
