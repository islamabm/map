export const locService = {
  getLocs,
  addLoc,
}

// const locs = [
//   { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
//   { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
// ]

const locs = loadFromStorage('locDB') || []

function addLoc(loc) {
  locs.push(loc)
  saveToStorage('locDB', locs)
}

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs)
    }, 2000)
  })
}

function loadFromStorage(key) {
  var val = localStorage.getItem(key)
  return JSON.parse(val)
}

function saveToStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}
