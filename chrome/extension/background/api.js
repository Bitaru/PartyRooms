import Firebase from 'firebase';
import uuid from 'uuid-js';
import { create as createPeer } from './peer/peers';
import setupHandshake, { connectUsers } from './peer/handshake';

const config = {
  apiKey: 'AIzaSyBiAFpWwich67wxfME2x2EOyoFc0e715CU',
  databaseURL: 'https://partyrooms-9ddaf.firebaseio.com/',
}

export const ME = uuid.create(1).toString();

const db = Firebase.initializeApp(config).database();

// const Session = Parse.Object.extend('Session');
// const Room = Parse.Object.extend('Room');
//
// // Set session for current user
// export const session = new Session();
// session.set('name', ME).save();

// const getSocket = (room) => {
//   const id = room.get('objectId');
//   const query = new Parse.Query(Room);
//   // query.equalTo('objectId', id);
//   return query.subscribe();
// };

export const createRoom = stream => {
  const ROOM_ID = uuid.create(1).toString();
  db.ref('room').set({ [ROOM_ID]: { initiator: ME } });
  const room = db.ref(`room/${ROOM_ID}`);
  setupHandshake(ROOM_ID, room);
  createPeer(room, ME, stream, true);
};

export const listen = ROOM_ID => {
  const room = db.ref(`room/${ROOM_ID}`);
  setupHandshake(ROOM_ID, room);
  room.child('users').on('value', res => {
    connectUsers(room, res);
    createPeer(room, ME);
  });
  // connectUsers(room, )
};
