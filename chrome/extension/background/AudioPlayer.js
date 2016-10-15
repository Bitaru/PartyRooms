import Room from './Room';

class AudioPlayer {
  constructor() {
    this.Player = new Audio();
  }

  setStream(stream) {
    this.Player.src = window.URL.createObjectURL(stream);
    return this;
  }

  play() {
    this.Player.play();
    return this;
  }

  stop() {
    this.Player.stop();
    return this;
  }

  volume(volume) {
    this.Player.volume = volume;
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
          resolve(stream);
        });
      });
    });
  }
}

export default new AudioPlayer();
