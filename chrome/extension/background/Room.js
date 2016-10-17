import Firebase from 'firebase';
import uuid from 'uuid-js';
import handshake from './handshake';
import socket from './socket';
import Events from '../../../app/lib/EventBus';
import AudioPlayer from './AudioPlayer';

const config = {
  apiKey: SETTINGS.firebase.key,
  databaseURL: SETTINGS.firebase.url
};

const ME = uuid.create(1).toString();

class Room {
  db = void 0;
  id = void 0;

  get isOwner() {
    return this.id === ME;
  }

  normalizeRooms() {
    return Object.keys(this.rooms).map(key => ({
      ...this.rooms[key],
      id: key,
      isOwner: ME === key,
      isListener: ME !== key && key === this.id
    }));
  }

  mapRooms(snapshot) {
    this.rooms = snapshot.val() || {};
    return this.normalizeRooms();
  }

  bindRoomsUpdate = (type) => {
    this.roomsRef[type]('value', snapshot =>
      Events.emit('update', { rooms: this.mapRooms(snapshot) })
    );
  }

  constructor() {
    this.db = Firebase.initializeApp(config).database();
    this.roomsRef = this.db.ref('room');
    this.bindRoomsUpdate('on');
    Events.on('stop', () => this.disconect());
    Events.on('getRooms', () => this.bindRoomsUpdate('once'));
  }

  disconect() {
    if (!this.id) return;
    if (this.id === ME) {
      this.roomsRef.child(ME).remove();
      socket.emit('close', this.id);
    }
    this.id = void 0;
    Events.emit('update', { room: 0, status: 0, rooms: this.normalizeRooms() });
  }

  connect() {
    Events.emit('update', { room: this.id });
  }

  create({ stream, ...props }) {
    this.disconect();
    this.id = ME;
    this.connect();

    const room = this.roomsRef.child(ME);
    room.set(props)
    .then(() => handshake({ room, stream }));
  }

  join({ id }) {
    this.disconect();
    this.id = id;
    this.connect();
    Events.emit('update', { room: this.id, status: 'listening' });

    const room = this.db.ref(`room/${id}`);
    room.child('users').push(id)
    .then(() => handshake({ room }));
  }
}

export default new Room();
