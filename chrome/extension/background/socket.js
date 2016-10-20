import IO from 'socket.io-client';
const socket = IO.connect(SETTINGS.sockets);
// const socket = IO.connect('http://localhost:3003');
export default socket;
