import { locService } from './loc.service.js'

export const mapService = {
  initMap,
  addMarker,
  panTo,
  //   findAdress,
}

// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
  return _connectGoogleApi().then(() => {
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    })
    gMap.addListener('click', (mapsMouseEvent) => {
      handleMapClick(mapsMouseEvent.latLng.toJSON())
    })
  })
}
function handleMapClick(ev) {
  const latitude = ev.lat
  const langitude = ev.lng
  const locationName = prompt('What is the name of the location?')
  const id = makeId()
  const createdAt = new Date()
  const updatedAt = createdAt

  const location = {
    locationName,
    createdAt,
    id,
    latitude,
    langitude,
    updatedAt,
    // weather,
  }

  locService.addLoc(location)
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
    animation: google.maps.Animation.DROP,
  })
  return marker
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()

  const API_KEY = '  AIzaSyC0oEwQyLbXgSFi586DEiU-02gF4xshG9k' //TODO: Enter your API Key
  var elGoogleApi = document.createElement('script')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject('Google script failed to load')
  })
}

function makeId(length = 6) {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var txt = ''
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

// function findAdress() {
//   let adress = document.querySelector('input[name="place-name"]')
//   console.log(adress.value)
//   //   const url = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD4d1aPv7gbAj7lc6m1wFwMnmMuBGApoLI&q=${adress.value}`

//   //   fetch(url).then((res) => console.log(res))
// }
