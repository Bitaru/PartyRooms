import Room from './Room';
import Events from '../../../app/lib/EventBus';

class AudioPlayer {
  constructor() {
    this.Player = new Audio();
    Events.on('volume', volume => this.setVolume(volume));
    Events.on('stop', () => this.stop());
  }

  setStream(stream) {
    this.Player.src = window.URL.createObjectURL(stream);
    return this;
  }

  play() {
    this.Player.play();
    Events.emit('update', { play: true });
    return this;
  }

  stop() {
    console.log('stop')
    this.Player.pause();
    Events.emit('update', { status: 0 });
    return this;
  }

  setVolume(volume) {
    this.Player.volume = volume;
    Events.emit('update', { volume });
    return this;
  }

  capture() {
    return new Promise(resolve => {
      chrome.tabs.getSelected(null, ({ id: initialTabId }) => {
        chrome.tabs.onRemoved.addListener(id => {
          if (initialTabId === id) Room.disconect();
        });
        chrome.tabCapture.capture({ audio: true, video: false }, stream => {
          this.setStream(stream).play();
          Events.emit('update', { status: 'streaming' });
          resolve(stream);
        });
      });
    });
  }
}

export default new AudioPlayer();
