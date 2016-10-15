import Firebase from 'firebase';
import uuid from 'uuid-js';
import handshake from './handshake';
import socket from './socket';
import Events from '../../../app/lib/EventBus';

const config = {
  apiKey: 'AIzaSyBiAFpWwich67wxfME2x2EOyoFc0e715CU',
  databaseURL: 'https://partyrooms-9ddaf.firebaseio.com/',
}

const ME = uuid.create(1).toString();

class Room {
  db = void 0;
  id = void 0;

  get isOwner() {
    return this.id === ME;
  }

  constructor() {
    this.db = Firebase.initializeApp(config).database();
    Events.on('stop', () => this.disconect());
  }

  disconect() {
    if (!this.id) return;
    if (this.id === ME) {
      this.db.ref(`room/${ME}`).remove();
      socket.emit('close', this.id);
    }
    this.id = void 0;
  }

  create({ stream, ...props }) {
    this.disconect();

    this.id = ME;
    const room = this.db.ref(`room/${ME}`)
    room.set(props)
    .then(() => handshake({ room, stream }));
  }

  join({ id }) {
    this.disconect();
    this.id = id;
    const room = this.db.ref(`room/${id}/users`)
    room.push(id)
    .then(() => handshake({ room }))
  }
}

export default new Room();
