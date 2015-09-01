function Storage() {
  var cache = this.cache = {}

  chrome.storage.onChanged.addListener(function(changes) {
    for (var key in changes) {
      cache[key] = changes[key].newValue
    }
  })
}

Storage.prototype._getStore = function(key) {
  // don't sync sidebar width
  var storeType = key === STORE.WIDTH ? 'local' : 'sync'
  return chrome.storage[storeType]
}

Storage.prototype._getKey = function(key) {
  // make token unique per host
  if (key === STORE.TOKEN) {
    key = location.hostname + '!' + key
  }
  return key
}

Storage.prototype.set = function(key, val, cb) {
  key = this._getKey(key)
  cb = cb || Function()

  this.cache[key] = val
  var item = {}
  item[key] = val
  this._getStore(key).set(item, cb)
}

Storage.prototype.get = function(key, cb) {
  key = this._getKey(key)

  if (!cb) return this.cache[key]

  this._getStore(key).get(key, function(item) {
    cb(item[key])
  })
}
