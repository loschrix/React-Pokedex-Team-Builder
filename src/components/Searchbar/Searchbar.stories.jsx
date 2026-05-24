import Searchbar from './Searchbar.jsx';

const meta = {
  title: 'Components/Searchbar',
  component: Searchbar,
  args: {
    value: '',
    onChange: () => {},
  },
};

export default meta;

export const Empty = {};

export const WithValue = {
  args: {
    value: 'pikachu',
  },
};
