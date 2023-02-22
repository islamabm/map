import { locService } from './loc.service.js'

export const mapService = {
  initMap,
  addMarker,
  panTo,
  getIcon,
  codeAddress,
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

function codeAddress(address) {

  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address: address }, function (results, status) {
      if (status == 'OK') {
        const loc = JSON.parse(JSON.stringify(results[0].geometry.location))
        console.log(loc)
        panTo(loc.lat, loc.lng)
        resolve({ latLng: loc, name: address })
      } else {
        alert('Geocode was not successful for the following reason: ' + status)
      }
    })
  })
}

function handleMapClick(ev) {
  const latitude = ev.lat
  const langitude = ev.lng
  let loc = { lat: latitude, lng: langitude }
  addMarker(loc)
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
  }

  locService.addLoc(location)
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
    icon: getIcon(),
    animation: google.maps.Animation.BOUNCE,
  })
  return marker
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()

  const API_KEY = 'AIzaSyC0oEwQyLbXgSFi586DEiU-02gF4xshG9k' //TODO: Enter your API Key
  var elGoogleApi = document.createElement('script')
  let adress = document.querySelector('input[name="place-name"]')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&q=${adress.value}`
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

function getIcon() {
  return {
    url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',

    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(100, 100),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32),
  }
}
