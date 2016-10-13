import * as peers from './peers.js';
import diff from 'lodash/difference';


let roomSize = 0;

export const handshake = ({ socket, room, user, stream, initiator }) => {
  function createPeer(props) {
    console.log('~~> Creating new user', props.user);
    return peers.create({ ...props, stream, socket });
  }

  function connectUsers({ room, users, initiator}) {
    console.log('~~> Connected users: ', users);
  
    users
    .filter(u => !peers.get(u.id))
    .forEach(u => createPeer({ room, user: u, initiator }));

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

  socket.emit('ready', { room: room.key, initiator });
  // room.child(`users/${user.id}`).set(user);
};
