import bluebird from 'bluebird';
import { session, ME, createRoom } from './background/api';
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
promisifyAll(chrome, [
  'tabs',
  'windows',
  'browserAction',
  'contextMenus'
]);
promisifyAll(chrome.storage, [
  'local'
]);

require('./background/inject');

chrome.runtime.onMessage.addListener(async (req, sender, res) => {
  if (req.type === 'createStream') {
    const stream = await getStream();
    createRoom(stream);
    res({ status: true });
  }
});
