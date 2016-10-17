chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  if (msg.type !== 'vk:avatar') return;
  const element = document.querySelectorAll('img.top_profile_img')[0];
  response(element && element.src);
});
