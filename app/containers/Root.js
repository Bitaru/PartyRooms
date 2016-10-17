import { compose, withHandlers, withState } from 'recompose';

import 'normalize.css';
import styles from './Root.css';
import Player from '../components/Player';
import List from '../components/List';
import Search from '../components/Search';
import Popup from '../components/Popup';

const POPUPS = {
  CREATE: 'CREATE'
};

export default compose(
  withState('popup', 'openPopup', false),
  withHandlers({
    onCreateRoom: props => () => props.openPopup(POPUPS.CREATE),
    closePopup: props => () => props.openPopup(false)
  })
)(({ onCreateRoom, popup, closePopup }) => (
  <div className={styles.container}>
    <Search />
    <List />
    <Player onCreateRoom={onCreateRoom} />
    <Popup open={popup === POPUPS.CREATE} onClose={closePopup} />
  </div>
));
