import Peer from 'simple-peer';
import socket from './socket';
import AudioPlayer from './AudioPlayer';
import config from './config';

let peers = {};

const createPeer = (id, initiator, stream) => {
  peers[id] = new Peer({
    initiator: initiator === id,
    stream,
    config
  });
  return peers[id];
};

export function create({ userId, stream, initiator }) {
  console.log('~~> PREPARE CONNECTION: ', userId);

  if (peers[userId]) {
    console.warn('!~~> REMOVE PEER:', userId);
    destroy(userId);
  }

  const peer = createPeer(userId, initiator, stream);

  peer.on('signal', signal => {
    console.log(`--> ${userId}`, signal);
    socket.emit('signal', { userId, signal });
  })
  .on('stream', s => {
    console.log('~~> STREAM', s);
    AudioPlayer.setStream(s);
  })
  .once('connect', () => {
    console.log('~~> ESTABLISHED CONNECTION WITH: ', userId);
    AudioPlayer.play();
  })
  .once('error', error => {
    console.warn('!~~> ERROR', userId, error);
    destroy(userId);
  })
  .once('close', () => {
    console.warn('!~~> CLOSE CONNECTION', userId);
    if (peers[userId] === peer) delete peers[userId];
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
  console.warn('!~~> REMOVE PEER:', userId);
  const peer = peers[userId];
  peer.destroy();
  delete peers[userId];
}

export function destroyAll() {
  getIds().forEach(destroy);
}
