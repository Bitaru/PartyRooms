import styles from './styles.css';
import cx from 'classnames';
import Rheostat from 'rheostat';
import { compose, withState, withHandlers } from 'recompose';

import './sliderStyles.css';

import RecordIcon from '../icons/record';
import PlayIcon from '../icons/play';
import VolumeIcon from '../icons/volume';

export default compose(
  withState('volume', 'setVolume', 100),
  withHandlers({
    updateVolume: props => value => {
      props.setVolume(value);
    }
  })
)(() => (
  <div className={styles.wrap}>
    <div className={styles.volume}>
      <VolumeIcon className={styles.volumeIcon} />
      <div className={styles.sliderWrap} >
        <Rheostat min={1} max={100} values={[100]} />
      </div>
    </div>
    <div className={styles.controlls}>
      <button className={cx(styles.actionButton, styles.record)}>
        <RecordIcon className={cx(styles.recordIcon)} />
      </button>
      <button className={cx(styles.actionButton, styles.play)}>
        <PlayIcon className={cx(styles.playIcon)} />
      </button>
    </div>
    <div className={styles.settings} />
  </div>
));
