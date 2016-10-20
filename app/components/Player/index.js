import React from 'react';

import styles from './styles.css';
import cx from 'classnames';
import Rheostat from 'rheostat';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle, branch, renderComponent } from 'recompose';
import Events from '../../lib/EventBus';

import './sliderStyles.css';

import RecordIcon from '../icons/record';
import PlayIcon from '../icons/play';
import StopIcon from '../icons/stop';
import VolumeIcon from '../icons/volume';

const RecordAction = ({ onClick, status }) => (
  <button onClick={onClick} className={cx(styles.actionButton, !!status && styles.active)}>
    {
      !!status
      ? <StopIcon className={styles.pauseIcon} />
      : <RecordIcon className={styles.recordIcon} />
    }
  </button>
);

const ListenAction = ({ onClick }) => (
  <button onClick={onClick} className={cx(styles.actionButton)}>
    <StopIcon className={styles.pauseIcon} />
  </button>
);

const ActionButton = branch(
  props => !props.status || props.status === 'streaming',
  renderComponent(RecordAction),
  renderComponent(ListenAction),
)(null);

export default compose(
  connect(({ volume, status }) => ({ volume, status })),
  withHandlers({
    updateVolume: () => res =>
      Events.emit('volume', res.values[0] / 100),
    handleButton: props => e => {
      e.preventDefault();
      switch (props.status) {
        case 'streaming':
          return Events.emit('stop');
        case 'listening':
          return Events.emit('stop');
        default:
          return props.onCreateRoom();
      }
    }
  }),
  lifecycle({
    componentWillMount() {
      Events.emit('volume', this.props.volume);
    }
  })
)(({ handleButton, updateVolume, volume, status }) => (
  <div className={styles.wrap}>
    <div className={styles.volume}>
      <VolumeIcon className={styles.volumeIcon} />
      <div className={styles.sliderWrap} >
        <Rheostat min={1} max={100} values={[volume * 100]} onChange={updateVolume} />
      </div>
    </div>
    <div className={styles.controlls}>
      <ActionButton status={status} onClick={handleButton} />
    </div>
    <div className={styles.settings}>
      <div />
    </div>
  </div>
));
