import * as peers from './peers.js';

function createPeer(room, user, owner) {
  return peers.create(room, user, void 0, owner);
}

export const connectUsers = (room, payload) => {
  const res = payload.val();
  if (!res || !res.users) return;
  const { initiator: owner, users } = res;

  console.log('Connected users: ', owner, users);

  Object.keys(users)
  .filter(id => !peers.get(id))
  .forEach(id => createPeer(room, users[id], owner));

  peers.getIds()
  .filter(id => !users[id])
  .forEach(peers.destroy);
}

export default (ROOM_ID, room) => {
  room.child('users').on('value', (payload) => {
    Object.keys(payload).forEach(key => {
      const { signal, userId } = payload[key];
      const peer = peers.get(userId);
      if (!peer) return;
      peer.signal(signal);
    });
  });

  room.child('users').on('child_changed', payload => {
    connectUsers(room, payload);
  });
  //
  // debug('socket.id: %s', socket.id);
  // debug('emit ready for room: %s', roomName);
  // notify.info('Ready for connections');
  // socket.emit('ready', roomName);
};
