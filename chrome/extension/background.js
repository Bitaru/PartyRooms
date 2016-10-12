import bluebird from 'bluebird';
import { stream, listen } from './background/api';
import getStream from './background/getStream';

global.Promise = bluebird;

function promisifier(method) {
  // return a function
  return function promisified(...args) {
    // which returns a promise
    return new Promise(resolve => {
      args.push(resolve);
      method.apply(this, args);
    });
  };
}

function promisifyAll(obj, list) {
  list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}

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

if (chrome.tabs) {
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