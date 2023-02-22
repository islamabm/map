import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLoc = onDeleteLoc
window.onGoLoc = onGoLoc
window.onSearchLoc = onSearchLoc

function onInit() {
  renderPlaces()
  mapService
    .initMap()
    .then(() => {
      console.log('hi')
    })
    .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos')
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

// when click add marker to the location
function onAddMarker() {
  console.log('Adding a marker')
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onDeleteLoc(locId) {
  locService.deleteLoc(locId)
  renderPlaces()
}

function onGoLoc(locLat, locLng) {
  mapService.initMap(locLng,locLat)
}

// add location to the list locs
function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs)
    document.querySelector('.locs').innerHTML = JSON.stringify(locs, null, 2)
  })
}

function onSearchLoc(ev) {
  console.log('itay')
  ev.preventDefault()
  mapService.findAdress()
}

// on click this btn changed the element html

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords)
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
      mapService.panTo(pos.coords.latitude, pos.coords.longitude)
    })

    .catch((err) => {
      console.log('err!!!', err)
    })
}
// when user click go to this
function onPanTo() {
  console.log('Panning the Map')
  mapService.panTo(35.6895, 139.6917)
}

function renderPlaces() {
  const locations = loadFromStorage('locDB')

  if (!locations) return

  let strHTMLs = locations
    .map((loc) => {
      return `<div class="place">
      <button onclick="onGoLoc(${loc.langitude},${loc.latitude})">GO</button>
      <button onclick="onDeleteLoc('${loc.id}')">❌</button>
    <h3 class="place-header">Location Name: ${loc.locationName}</h3>
    <p> created At: ${loc.createdAt}</p>
    <p> Lat:${loc.latitude}, Lng:${loc.langitude}</p>

    </div>`
    })
    .join('')

  document.querySelector('.locs').innerHTML = strHTMLs
}

function loadFromStorage(key) {
  var val = localStorage.getItem(key)
  return JSON.parse(val)
}
