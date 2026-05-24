import { render, screen } from '@testing-library/react';
import Navbar from './Navbar.jsx';

describe('Navbar', () => {
  test('renders without crashing', () => {
    render(<Navbar />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
