import AudioPlayer from './background/AudioPlayer';
import Events from '../../app/lib/EventBus';
import Room from './background/Room';

window.Raven.config(SETTINGS.sentry).install();

Events.on('createRoom', async props => {
  const stream = await AudioPlayer.capture();
  Room.create({ ...props, stream });
});

Events.on('joinRoom', props => {
  Room.join(props);
});

window.listen = (id) => Room.join({ id });
window.stop = () => Room.disconect();
