import { PokedexStatus } from './PokedexStatus.jsx';

const meta = {
  title: 'Components/PokedexStatus',
  component: PokedexStatus,
};

export default meta;

export const Hidden = {
  args: {
    isLoading: true,
    hasMore: true,
    hasActiveSearch: false,
    hasResults: true,
  },
};

export const EndOfList = {
  args: {
    isLoading: false,
    hasMore: false,
    hasActiveSearch: false,
    hasResults: true,
  },
};
