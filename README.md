# PartyRooms p2p

> Chrome extension for sharing and listening sound from tab

## What's inside:

 - [Simple-Peer](https://github.com/feross/simple-peer) - for WebRTC connection
 - [Socket.io](http://socket.io/) - Transfer signals between clients
 - [Firebase](https://firebase.google.com) - Just coz this is MVP
 - [React](https://github.com/facebook/react) / [Redux](https://github.com/reactjs/redux) / [Redux-persist](https://github.com/rt2zz/redux-persist) - UI in popup window


> - Based on [React Chrome Extension Boilerplate](https://github.com/jhen0409/react-chrome-extension-boilerplate)
> - Many thanks to [Peer Calls](https://github.com/jeremija/peer-calls) for insight

### Install dependencies
```
npm install
```

### Development

```
# build files to './dev'
$ npm run dev

# run server with sockets localy
$ node sockets.js
```

> If you're developing Inject page, please allow `https://localhost:3000` connections. (Because `injectpage` injected GitHub (https) pages, so webpack server procotol must be https.)
> [Load unpacked extensions](https://developer.chrome.com/extensions/getstarted#unpacked) with `./dev` folder.

### Build

```bash
# build files to './build'
$ npm run build
```

### Compress

```bash
# compress build folder to {manifest.name}.zip and crx
$ npm run build
$ npm run compress -- [options]
```

### LICENSE

[MIT](LICENSE)
