import Firebase from 'firebase';
import uuid from 'uuid-js';
import lunr from 'lunr';

import handshake from './handshake';
import socket from './socket';
import Events from '../../../app/lib/EventBus';

const config = {
  apiKey: SETTINGS.firebase.key,
  databaseURL: SETTINGS.firebase.url
};

const ME = uuid.create(1).toString();
console.log(ME);

class Room {
  db = void 0;
  id = void 0;
  query = void 0;
  rooms = {};
  index = lunr(function(){
    this.ref('id');
    this.field('name', { boost: 10 });
    this.field('tags');
  })

  get isOwner() {
    return this.id === ME;
  }

  normalizeRooms(rooms) {
    return rooms.map(room => ({
      ...room,
      isOwner: ME === room.id,
      isListener: ME !== room.id && room.id === this.id
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

  findRooms() {
    const rooms = this.normalizeRooms(
      !this.query
      ? Object.keys(this.rooms).map(id => ({ ...this.rooms[id], id }))
      : this.index.search(this.query).map(({ ref }) => ({ ...this.rooms[ref], id: ref })));
    Events.emit('update', { rooms })
  }

  constructor() {
    this.db = Firebase.initializeApp(config).database();
    this.roomsRef = this.db.ref('room');

    this.roomsRef.once('value', snapshot => {
      const rooms = snapshot.val();
      if (!rooms) return;
      this.rooms = { ...this.rooms, ...rooms };
      Object.keys(rooms).forEach(id => this.index.add({
        name: rooms[id].name,
        tags: rooms[id].tags,
        id
      }));
      this.findRooms();
    });

    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      const id = snapshot.key;
      this.rooms[id] = room;
      this.index.update({ ...room, id });
      this.findRooms();
    });

    this.roomsRef.on('child_removed', snapshot => {
      this.index.remove({ id: snapshot.key });
      delete this.rooms[snapshot.key];
      this.findRooms();
    });

    Events.on('stop', () => this.disconect());

    Events.on('getRooms', query => {
      this.query = query;
      this.findRooms();
    });
  }

  disconect() {
    if (!this.id) return;
    if (this.isOwner) this.roomsRef.child(ME).remove();
    socket.emit('close', socket.id);
    this.id = void 0;
    Events.emit('update', { room: 0, status: 0 });
    this.findRooms();
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
    .then(() => handshake({ room, stream, owner: true }));
  }

  join({ id }) {
    this.disconect();
    this.id = id;
    this.connect();
    Events.emit('update', { room: this.id, status: 'listening' });

    const room = this.db.ref(`room/${id}`);
    handshake({ room });
    this.findRooms();
  }
}

export default new Room();
