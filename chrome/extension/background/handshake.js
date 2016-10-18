import socket from './socket';
import * as peers from './peers.js';

export default ({ room, stream, owner }) => {

  function connectUsers({ room, users, initiator }) {
    console.log('~~> Connected users: ', users);

    users
    .filter(user => !peers.get(user.id))
    .forEach(user => peers.create({ room, user, initiator, stream }));

    peers.getIds()
    .filter(id => users.includes(id))
    .forEach(peers.destroy);
  }

  socket.on('users', ({ users, initiator }) => {
    console.log('~~> Getting users', users);
    connectUsers({ room, users, initiator });
  });

  socket.on('signal', ({ userId, signal }) => {
    const peer = peers.get(userId);
    if (!peer || userId === socket.id) return;
    console.log('I got signal from ', userId, signal);
    peer.signal(signal);
  });

  socket.on('close', () => {
    console.warn('X_X disconecting all room');
    socket.emit('leaving');
    peers.destroyAll();
    socket.removeAllListeners();
  });

  socket.emit('ready', { room: room.key, owner });
};
