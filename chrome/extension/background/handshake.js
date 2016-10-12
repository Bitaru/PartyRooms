import * as peers from './peers.js';


let roomSize = 0;

export const handshake = ({ room, user, stream }) => {

  function createPeer(props) {
    console.log('~~> Creating new user', props.user);
    return peers.create({ ...props, stream });
  }

  function connectUsers({ room, users, initiator }) {
    console.log('~~> Connected users: ', users);

    Object.keys(users)
    .filter(id => !peers.get(id))
    .forEach(id => createPeer({ room, user: users[id], initiator }));

    peers.getIds()
    .filter(id => !users[id])
    .forEach(peers.destroy);
  }

  room.on('value', payload => {
    const { users, initiator } = payload.val();
    const newRoomSize = Object.keys(users).length;
    // If users count not changed then its just update
    if (roomSize === newRoomSize) return;
    
    roomSize = newRoomSize;
    connectUsers({ room, users, initiator });
  });

  room.child('users').on('child_changed', payload => {
    const { id, signal } = payload.val();
    const peer = peers.get(id);
    console.log('I got signal from ', id, signal);
    if (!peer || !signal || id === user.id) return;
    peer.signal(signal);
  });

  room.child(`users/${user.id}`).set(user);
};
