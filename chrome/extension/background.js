import { stream, listen } from './background/api';
import getStream from './background/getStream';

// let chrome extension api support Promise
// promisifyAll(chrome, [
//   'tabs',
//   'windows',
//   'browserAction',
//   'contextMenus'
// ]);
// promisifyAll(chrome.storage, [
//   'local'
// ]);

// require('./background/inject');

if (chrome && chrome.tabs) {
  chrome.runtime.onMessage.addListener(async (req, sender, res) => {
    if (req.type === 'createStream') {
      const audioStream = await getStream();
      stream(audioStream);
      res({ status: true });
    }

    if (req.type === 'listenStream') {
      listen(req.id);
      res({ status: true });
    }
  });
}

window.listen = listen;