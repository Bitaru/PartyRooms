const express = require('express');
const os = require('os');
const Firebase = require('firebase')
const config = require('./config.json');

const DB = Firebase
  .initializeApp({
    apiKey: config.firebase.key,
    databaseURL: config.firebase.url
  }).database()

const PORT = process.env.PORT || 3003;
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);

const ifaces = os.networkInterfaces();
const getUsers = room => Object.keys(io.sockets.adapter.rooms[room].sockets);

io.on('connection', function (socket) {
  // Get all users in room
  socket.on('ready', payload => {
    const room = payload.room;
    console.log(socket.room);
    console.log(socket.id);
    console.log('======');

    if (socket.room) socket.leave(socket.room);
    socket.join(room);
    socket.room = room;
    socket.owner = payload.owner;

    io.to(room).emit('users', {
      initiator: socket.id,
      users: getUsers(room)
    });

    // Add user to list
    DB.ref(`room/${socket.room}/users`).set({ [socket.id]: true })
  });

  socket.on('close', userId => {
    io.to(socket.room).emit('close', { userId, force: socket.owner });
    if (userId === socket.id) socket.leave(socket.room);

    // Remove user from list
    DB.ref(`room/${socket.room}/users/${userId}`).remove()
  });

  // Signal to all local copies of peer
  socket.on('signal', payload => {
    io.to(payload.userId).emit('signal', {
      userId: socket.id,
      signal: payload.signal
    });
  });

  socket.on('disconnect', () => {
    if (socket.owner) DB.ref(`room/${socket.room}`).remove();
    io.to(socket.room).emit('close', { userId: socket.id, force: socket.owner });
  });
});

http.listen(PORT, function() {
  Object.keys(ifaces).forEach(ifname =>
    ifaces[ifname].forEach(iface =>
      console.log('listening on', iface.address, 'and port', PORT)));
});
