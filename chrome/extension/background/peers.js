import Peer from 'simple-peer';
import socket from './socket';
import AudioPlayer from './AudioPlayer';

let peers = {};

const createPeer = (id, initiator, stream) => {
  peers[id] = new Peer({
    initiator: initiator === id,
    stream
  });
  return peers[id];
};

export function create({ user, stream, initiator }) {
  console.log(`~~> Connecting to peer ${user.id}`);

  if (peers[user.id]) {
    console.warn(`!~~> Peer ${user.id} already exist, removing from list`);
    destroy(user.id);
  }

  const peer = createPeer(user.id, initiator, stream);

  peer.on('signal', signal => {
    console.log(`${user.id} sending signal!!!`, signal);
    socket.emit('signal', { userId: user.id, signal });
  })
  .on('stream', s => {
    console.log('I"ve got a stream', s);
    AudioPlayer.setStream(s);
  })
  .once('connect', () => {
    console.log(`^___^ Peer ${user.id} is connected now!`);
    AudioPlayer.play();
  })
  .once('error', error => {
    console.warn('!~~> A peer connection error occurred', error);
    destroy(user.id);
  })
  .once('close', () => {
    console.warn(`X_X Peer ${user.id} has close connection`);
    socket.emit('close', user.id)
    if (peers[user.id] === peer) delete peers[user.id];
  });
}

export function get(userId) {
  return peers[userId];
}

export function getAll() {
  return peers;
}

export function getIds() {
  return Object.keys(peers);
}

export function clear() {
  peers = {};
}

export function destroy(userId) {
  const peer = peers[userId];
  peer.destroy();
  delete peers[userId];
}

export function destroyAll() {
  getIds().forEach(destroy);
}
