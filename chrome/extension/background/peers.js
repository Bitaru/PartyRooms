import Peer from 'simple-peer';

let peers = {};


const createPeer = (id, initiator, stream) => {
  peers[id] = new Peer({
    initiator,
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

export function create({ room, user, stream, initiator }) {
  console.log(`~~> Connecting to peer ${user.id}`);

  const userIsHost = user.id === initiator;
  const userSignal = room.child(`users/${user.id}/signal`);

  if (peers[user.id]) {
    console.warn(`!~~> Peer ${user.id} already exist, removing from list`);
    destroy(user.id);
  }

  const peer = createPeer(user.id, userIsHost, stream);

  peer.on('signal', signal => {
    console.log(`${user.id} sending signal!!!`);
    userSignal.set(signal);
  })
  .on('stream', s => {
    console.log('I"ve got a stream', s);
  })
  .once('connect', () => {
    console.log(`^___^ Peer ${user.id} is connected now!`);
  })
  .once('error', error => {
    console.warn('!~~> A peer connection error occurred', error);
    destroy(user.id);
  })
  .once('close', () => {
    console.warn(`XXX Peer ${user.id} connection closed XXX`);
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
