import React from 'react';

import { compose, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import cx from 'classnames';
import Events from '../../lib/EventBus';

import styles from './styles.css';
import RecordIcon from '../icons/record';
import PlayIcon from '../icons/play';

const Room = compose(
  withProps(props => ({
    avaible: !(props.isOwner || props.isListener)
  })),
  withHandlers({
    onClick: props => e => {
      e.preventDefault();
      if (props.isOwner || props.isListener) return;
      Events.emit('joinRoom', { id: props.id });
    }
  })
)(({ avaible, image, name, tags, isOwner, isListener, onClick }) => (
  <li
    onClick={onClick}
    className={cx(
      styles.room,
      isOwner && styles.owner,
      isListener && styles.listener,
      avaible && styles.avaible
    )}>
    <div className={styles.avatar} style={{ backgroundImage: `url(${image})` }}>
      <div className={styles.statusWrap}>
        {isOwner && <div className={styles.statusIcon}><RecordIcon /></div>}
        {isListener && <div className={styles.statusIcon}><PlayIcon /></div>}
      </div>
    </div>
    <div className={styles.body}>
      <h3>{name}</h3>
      {tags && <p>{tags}</p>}
    </div>
    <div className={styles.overlay}>
      {isOwner && <p className={styles.text}>Your stream</p>}
      {isListener && <p className={styles.text}>Current stream</p>}
    </div>
    {
      avaible &&
        <div className={styles.avaibleOverlay}>
          <p className={styles.text}>Join this Room</p>
        </div>
    }
  </li>
));

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
