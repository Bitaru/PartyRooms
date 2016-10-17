import IO from 'socket.io-client';
// const socket = IO.connect('https://fathomless-spire-79427.herokuapp.com');
const socket = IO.connect(SETTINGS.sockets);
export default socket;
