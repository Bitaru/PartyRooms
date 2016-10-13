import * as peers from './peers.js';

export const handshake = ({ socket, room, user, stream }) => {
  function connectUsers({ room, users, initiator}) {
    console.log('~~> Connected users: ', users);
    
    users
    .filter(user => !peers.get(user.id))
    .forEach(user => peers.create({ room, user, initiator, stream, socket }));

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

  socket.emit('ready', { room: room.key });
};
