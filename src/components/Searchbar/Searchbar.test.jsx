import { render, screen, fireEvent } from '@testing-library/react';
import Searchbar from './Searchbar.jsx';

describe('Searchbar', () => {
  test('calls onChange when typing', () => {
    const onChange = jest.fn();

    render(<Searchbar value="" onChange={onChange} />);

    fireEvent.change(screen.getByPlaceholderText('Try Pikachu, 025...'), {
      target: { value: 'pikachu' },
    });

    expect(onChange).toHaveBeenCalledWith('pikachu');
  });

  test('clear button state and behavior reflect value', () => {
    const onChange = jest.fn();
    const { rerender } = render(<Searchbar value="" onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();

    rerender(<Searchbar value="pikachu" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onChange).toHaveBeenCalledWith('');
  });
});
