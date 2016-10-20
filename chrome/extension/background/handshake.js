import socket from './socket';
import * as peers from './peers.js';
import Room from './Room';
import AudioPlayer from './AudioPlayer';

window.peers = peers;
export default ({ room, stream, owner }) => {
  socket.on('users', ({ users, initiator }) => {
    console.log('~~> USERS: ', users);

    // Create new peer for each user if peer not exist
    users
    .filter(id => !peers.get(id))
    .forEach(userId => peers.create({ room, userId, initiator, stream }));

    // Remove peers who left the room
    peers.getIds()
    .filter(id => !users.includes(id))
    .forEach(peers.destroy);
  });

  socket.on('close', ({ userId, force }) => {
    if (peers.get(userId)) peers.destroy(userId);
    if (userId === socket.id || force) {
      console.warn('!~~> DESTROY SELF', socket.id);
      peers.clear();
      socket.removeAllListeners();
      Room.disconect();
      AudioPlayer.stop();
    }
  });

  // socket.on('leave', userId => {
  //   console.log('leave!!!SDDAWFWFWF')
  //   if (userId === socket.id) {
  //     peers.clear();
  //   }
  // });

  socket.on('signal', ({ userId, signal }) => {
    const peer = peers.get(userId);
    if (!peer || userId === socket.id) return;
    console.log(`<-- ${userId}`, signal);
    peer.signal(signal);
  });

  socket.emit('ready', { room: room.key, owner });
};
