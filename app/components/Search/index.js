import React from 'react';

import { compose, withState, withHandlers } from 'recompose';
import styles from './styles.css';
import SearchIcon from '../icons/Search';
import CrosshIcon from '../icons/cross';
import cx from 'classnames';
import Events from '../../lib/EventBus';

export default compose(
  withState('value', 'setValue', ''),
  withHandlers({
    update: props => value => {
      Events.emit('getRooms', value);
      props.setValue(value);
    }
  }),
  withHandlers({
    reset: props => e => {
      e.preventDefault();
      props.update('')
    },
    handleChange: props => event => props.update(event.target.value)
  })
)(({ handleChange, reset, value }) => (
  <form className={cx(styles.wrap, !!value && styles.active)}>
    <SearchIcon className={cx(styles.icon, !!value && styles.active)} />
    <input
      type='search'
      value={value}
      className={styles.input}
      onChange={handleChange}
      placeholder='Find something' />
    {
      !!value &&
        <button className={styles.cross} onClick={reset}>
          <CrosshIcon className={styles.crossIcon} />
        </button>
    }
  </form>
));
