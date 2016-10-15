const express = require('express');
const map = require('lodash/map');
const os = require('os');


const PORT = process.env.PORT || 3003;
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);

const ifaces = os.networkInterfaces();

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

  socket.on('close', roomId => {
    io.to(roomId).emit('close');
  });

  socket.on('leaving', () => {
    if (socket.room) socket.leave(socket.room);
  });

  socket.on('ready', payload => {
    const room = payload.room;
    if (socket.room) socket.leave(socket.room);
    socket.room = room;
    socket.join(room);
    socket.room = room;

    io.to(room).emit('users', {
      initiator: socket.id,
      users: getUsers(room)
    });
  });
});

http.listen(PORT);
