import Peer from 'simple-peer';
import { injectAudio } from './getStream';

let peers = {};
let audio = void 0;

const createPeer = (id, initiator, stream) => {
  peers[id] = Peer({
    initiator: initiator === id,
    stream,
    config: {
      iceServers: [{
        url: 'stun:23.21.150.121',
        urls: 'stun:23.21.150.121'
      }, {
        url: 'turn:numb.viagenie.ca',
        urls: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
      }]
    }
  });
  return peers[id];
};

export function create({ socket, room, user, stream, initiator }) {
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
    const url = window.URL.createObjectURL(s)
    audio = new Audio(url);
  })
  .once('connect', () => {
    console.log(`^___^ Peer ${user.id} is connected now!`);
    if (audio) audio.play();
  })
  .once('error', error => {
    console.warn('!~~> A peer connection error occurred', error);
    destroy(user.id);
  })
  .once('close', () => {
    console.warn(`X_X Peer ${user.id} has close connection`);
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
