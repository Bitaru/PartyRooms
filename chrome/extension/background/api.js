import Firebase from 'firebase';
import uuid from 'uuid-js';
import { handshake, connectToUsers } from './handshake';
import IO from 'socket.io-client';

const socket = IO.connect('http://localhost:3003', { port: 3003 });

const config = {
  apiKey: 'AIzaSyBiAFpWwich67wxfME2x2EOyoFc0e715CU',
  databaseURL: 'https://partyrooms-9ddaf.firebaseio.com/',
}

export const ME = uuid.create(1).toString();
export const DB = Firebase.initializeApp(config).database();

const connectRoom = roomId => DB.ref(`room/${roomId}`);

const createRoom = async roomId => {
  await DB.ref(`room/${roomId}/initiator`).set(ME);
  return connectRoom(roomId);
};

export const stream = async stream => {
  const ROOM_ID = uuid.create(1).toString();
  const room = await createRoom(ROOM_ID);
  handshake({ socket, room, user: { id: ME }, stream, initiator: true });
  alert(ROOM_ID);
};

export const listen = ROOM_ID => {
  const room = connectRoom(ROOM_ID);
  handshake({ socket, room, user: { id: ME }  });
};
