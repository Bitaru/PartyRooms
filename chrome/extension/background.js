import AudioPlayer from './background/AudioPlayer';
import Events from '../../app/lib/EventBus';
import Room from './background/Room';

Events.on('createRoom', async props => {
  const stream = await AudioPlayer.capture();
  Room.create({ ...props, stream });
});

Events.on('joinRoom', props => {
  Room.join(props);
});

window.listen = Room.join;
