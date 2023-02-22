export const locService = {
  getLocs,
  addLoc,
  deleteLoc,
  save,
}
import { storageService } from './async-storage.service.js'

const locs = loadFromStorage('locDB') || []

function addLoc(loc) {
  locs.push(loc)
  saveToStorage('locDB', locs)
  return locs
}

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs)
    }, 2000)
  })
}

function deleteLoc(locId) {
  const locIdx = locs.findIndex((loc) => loc.id === locId)
  locs.splice(locIdx, 1)
  saveToStorage('locDB', locs)
}

function loadFromStorage(key) {
  var val = localStorage.getItem(key)
  return JSON.parse(val)
}

function saveToStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

function save(loc) {
  if (loc.id) {
    return storageService.put('locDB', loc)
  } else {
    return storageService.post('locDB', loc)
  }
}
