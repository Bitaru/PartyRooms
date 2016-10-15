import IO from 'socket.io-client';
// const socket = IO.connect('https://fathomless-spire-79427.herokuapp.com');
const socket = IO.connect('http://localhost:3003');
export default socket;
