import EventEmitter from 'wolfy87-eventemitter';

const emitter = new EventEmitter();

chrome.runtime.onMessage.addListener(({ type, data }) => emitter.trigger(type, [data]));

const on = (...props) => emitter.addListener(...props);
const off = (...props) => emitter.removeListener(...props);
const emit = (type, data) => chrome.runtime.sendMessage({ type, data });
const getContent = (namespace, type) => new Promise(resolve => {
  chrome.tabs.query({ url: 'https://vk.com/*' }, (tabs) => {
    if (!tabs[0]) return resolve(require('../../chrome/assets/img/dummy.jpg'));
    return chrome.tabs.sendMessage(tabs[0].id, { type: `${namespace}:${type}` }, resolve);
  });
});

export default { on, off, emit, getContent };
