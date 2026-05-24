import { render, screen, fireEvent } from '@testing-library/react';
import { TeamMember } from './TeamMember.jsx';

const pokemon = {
  id: 4,
  name: 'charmander',
  image: 'charmander.png',
  types: ['fire'],
};

describe('TeamMember', () => {
  test('renders team slot details', () => {
    render(<TeamMember pokemon={pokemon} index={0} onRemove={jest.fn()} />);

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('Charmander')).toBeInTheDocument();
    expect(screen.getByText('fire')).toBeInTheDocument();
  });

  test('calls onRemove with pokemon id on click', () => {
    const onRemove = jest.fn();

    render(<TeamMember pokemon={pokemon} index={0} onRemove={onRemove} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onRemove).toHaveBeenCalledWith(4);
  });
});
