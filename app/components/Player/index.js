import styles from './styles.css';
import cx from 'classnames';
import Rheostat from 'rheostat';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import Events from '../../lib/EventBus';

import './sliderStyles.css';

import RecordIcon from '../icons/record';
import PlayIcon from '../icons/play';
import PauseIcon from '../icons/pause';
import VolumeIcon from '../icons/volume';

export default compose(
  connect(({ volume, status }) => ({ volume, status })),
  withHandlers({
    updateVolume: () => res =>
      Events.emit('volume', res.values[0] / 100),
    onRecord: () => () =>
      Events.emit('createRoom', { name: 'Oresama', tags: 'Jrock, Jpop, Ambient' }),
    bigButtonAction: ({ status }) => () =>
      !!status ? Events.emit('stop') : () => {}
  }),
  lifecycle({
    componentWillMount() {
      Events.emit('volume', this.props.volume);
    }
  })
)(({ onRecord, updateVolume, volume, status, bigButtonAction }) => (
  <div className={styles.wrap}>
    <div className={styles.volume}>
      <VolumeIcon className={styles.volumeIcon} />
      <div className={styles.sliderWrap} >
        <Rheostat min={1} max={100} values={[volume * 100]} onChange={updateVolume} />
      </div>
    </div>
    <div className={styles.controlls}>
      <button onClick={onRecord} className={cx(styles.actionButton, styles.record)}>
        <RecordIcon className={cx(styles.recordIcon)} />
      </button>
      <button className={cx(styles.actionButton, styles.play)} onClick={bigButtonAction}>
        {
          !!status
          ? <PauseIcon className={cx(styles.pauseIcon)} />
          : <PlayIcon className={cx(styles.playIcon)} />
        }
      </button>
    </div>
    <div className={styles.settings}>
      <div />
    </div>
  </div>
));
