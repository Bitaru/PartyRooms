import { compose, lifecycle } from 'recompose';

import 'normalize.css';
import styles from './Root.css';
import Events from '../lib/EventBus';
import Player from '../components/Player';
import List from '../components/List';
import Search from '../components/Search';

export default compose(
  lifecycle({
    componentWillMount() {
      Events.emit('getRooms');
    }
  })
)(props => (
  <div className={styles.container}>
    <Search />
    <List />
    <Player />
  </div>
));
