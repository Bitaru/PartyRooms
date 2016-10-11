import Parse from 'parse';
import uuid from 'uuid-js';
import { create as createPeer} from './peer/peers';

Parse.initialize(
  'WI6UETd8J5KWYBGLDkMRFLCWmxOydMZozc335CyB',
  'NtRJUTKtLpJg50YHKFyltalVwrBiDOGTvOhjs55k'
);

export const ME = uuid.create(1).toString();

const Session = Parse.Object.extend('Session');
const Room = Parse.Object.extend('Room');

// Set session for current user
export const session = new Session();
session.set('name', ME).save();

export const createRoom = stream => {
  const myRoom = new Room();
  myRoom.set('owner', ME).save();
  createPeer(myRoom, session, stream, true);
};
