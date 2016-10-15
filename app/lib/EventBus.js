import EventEmitter from 'wolfy87-eventemitter';

const emitter = new EventEmitter();

chrome.runtime.onMessage.addListener(({ type, data }) => emitter.trigger(type, [data]));

const on = (...props) => emitter.addListener(...props);
const off = (...props) => emitter.removeListener(...props);
const emit = (type, data) => chrome.runtime.sendMessage({ type, data });

export default { on, off, emit };
