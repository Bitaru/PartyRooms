import { compose } from 'recompose';

import 'normalize.css';
import styles from './Root.css';

import Player from '../components/Player';
import List from '../components/List';
import Search from '../components/Search';

export default props => {
  return (
    <div className={styles.container}>
      <Search />
      <List />
      <Player />
    </div>
  );
};
