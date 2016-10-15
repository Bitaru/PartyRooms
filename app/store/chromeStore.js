export default {
  getItem(key, cb) {
    chrome.storage.local.get(null, (data) => {
      if (chrome.runtime.lastError) return cb(chrome.runtime.lastError);

      // data will be null if local storage is empty
      data = data || {}
      cb(null, data[key])
    })
  },

  setItem(key, value, cb) {
    console.log(key, value);
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) return cb(chrome.runtime.lastError)
      cb(null)
    })
  },

  removeItem(key, cb) {
    chrome.storage.local.remove(key, () => {
      if (chrome.runtime.lastError) return cb(chrome.runtime.lastError)
      cb(null)
    })
  },

  getAllKeys(cb) {
    chrome.storage.local.get(null, (data) => {
      if (chrome.runtime.lastError) return cb(chrome.runtime.lastError)
      data = data || {}
      cb(null, Object.keys(data))
    })
  }
}
