import { render, screen } from '@testing-library/react';
import { PokedexStatus } from './PokedexStatus.jsx';

describe('PokedexStatus', () => {
  test('shows end-of-list message only for terminal state', () => {
    const { rerender } = render(
      <PokedexStatus isLoading hasMore hasActiveSearch={false} hasResults />
    );

    expect(screen.queryByText('You reached the end of the full Kanto list.')).not.toBeInTheDocument();

    rerender(
      <PokedexStatus isLoading={false} hasMore={false} hasActiveSearch={false} hasResults />
    );

    expect(screen.getByText('You reached the end of the full Kanto list.')).toBeInTheDocument();
  });
});
