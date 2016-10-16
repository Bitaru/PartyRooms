import { compose } from 'recompose';
import { connect } from 'react-redux';

import styles from './styles.css';

const Room = props => (
  <li className={styles.room}>
    {props.id}
  </li>
);

export default compose(
  connect(({ rooms = [] }) => ({ rooms }))
)(({ rooms }) => (
  <ul className={styles.wrap}>
    {rooms.map(room => <Room key={room.id} {...room} />)}
  </ul>
));
