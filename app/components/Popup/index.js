import { compose, withHandlers } from 'recompose';
import cx from 'classnames';
import styles from './styles.css';
import Events from '../../lib/EventBus';

import CrossIcon from '../icons/cross';
import logo from './icon.png';

export default compose(
  withHandlers({
    onSumit: props => async e => {
      e.preventDefault();
      const target = e.target;
      const image = await Events.getContent('vk', 'avatar');
      Events.emit('createRoom', {
        name: target.title.value,
        tags: target.tags.value,
        image
      });
      props.onClose();
    }
  })
)(({ onClose, onSumit, open }) => (
  <div className={cx(styles.wrap, open && styles.open)}>
    <div className={styles.container}>
      <button className={styles.close} onClick={onClose}>
        <CrossIcon className={styles.cross} />
      </button>
      <div>
        <div className={styles.header}>
          <img src={logo} className={styles.logo} role='presentation' />
          <h3>Make a party!</h3>
        </div>
        <form onSubmit={onSumit} autoComplete='off'>
          <input className={styles.input} name='title' type='text' placeholder='Room name' required />
          <textarea className={styles.textarea} name='tags' placeholder='Desctiption or tags' />
          <button type='submit' className={styles.submit}>Create room</button>
        </form>
      </div>
    </div>
  </div>
));
