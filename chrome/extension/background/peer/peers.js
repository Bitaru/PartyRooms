import Peer from 'simple-peer';
let peers = {};

/**
 * @param {Socket} socket
 * @param {User} user
 * @param {String} user.id
 * @param {Boolean} [initiator=false]
 * @param {MediaStream} [stream]
 */

export function create(room, session, stream = false, initiator = false) {
  console.log('Connecting to peer...');
  const userId = session.get('name');

  if (peers[userId]) {
    destroy(userId);
  }

  const peer = peers[userId] = new Peer({
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

  peer.once('error', () => {
    console.log('A peer connection error occurred');
    destroy(userId);
  });

  peer.on('signal', signal => {
    console.log('peer: %s, signal: %o', userId, signal);

    const payload = { userId, signal };
    console.log(payload);
  });

  peer.once('connect', () => {
    console.log('connected');
  });

  peer.on('stream', s => {
    console.log(s);
  });

  peer.once('close', () => {
    console.log('Peer connection closed');
    if (peers[userId] === peer) delete peers[userId];
  });
}

export function get(userId) {
  return peers[userId];
}

export function getIds() {
  return Object.keys(peers).map(key => peers[key].id);
}

export function clear() {
  peers = {};
}

export function destroy(userId) {
  const peer = peers[userId];
  peer.destroy();
  delete peers[userId];
}
