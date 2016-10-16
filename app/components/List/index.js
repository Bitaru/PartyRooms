import { compose } from 'recompose';
import { connect } from 'react-redux';

import styles from './styles.css';

const Room = ({ image, name, tags }) => (
  <li className={styles.room}>
    <div className={styles.avatar} style={{ backgroundImage: `url(${image})` }} />
    <div className={styles.body}>
      <h3>{name}</h3>
      {tags && <p>{tags}</p>}
    </div>
  </li>
);

export default compose(
  connect(({ rooms = [] }) => ({ rooms }))
)(({ rooms }) => (
  <ul className={styles.wrap}>
    {
      !rooms.length
      && <li className={styles.noRooms}>No Active rooms found :[</li>
    }
    {rooms.map(room => <Room key={room.id} {...room} />)}
  </ul>
));
