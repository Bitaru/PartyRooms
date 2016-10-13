const express = require('express');
const map = require('lodash/map');
const os = require('os');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);

const ifaces = os.networkInterfaces();

const rooms = {};

function getUsers(roomName) {
  return map(io.sockets.adapter.rooms[roomName].sockets, (_, id) => {
    return {
      id
    };
  });
}

io.on('connection', socket => {
  socket.on('signal', payload => {
    io.to(payload.userId).emit('signal', {
      userId: socket.id,
      signal: payload.signal
    });
  });

  socket.on('ready', ({ room, initiator }) => {
    if (socket.room) socket.leave(socket.room);
    socket.room = room;
    socket.join(room);
    socket.room = room;
    if (initiator) {
      rooms[room] = socket.id;
    }

    io.to(room).emit('users', {
      initiator: rooms[room],
      users: getUsers(room)
    });
  });
});

http.listen(3003, "127.0.0.1");