export const injectAudio = stream => {
  const audio = new Audio(window.URL.createObjectURL(stream));
  audio.play();
  return stream;
};

export default () => new Promise(resolve => {
  chrome.tabs.getSelected(null, () => {
    chrome.tabCapture.capture({ audio: true, video: false }, s => resolve(injectAudio(s)));
  });
});
