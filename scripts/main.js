  
function textfield () {
  var button = document.querySelector('.button')
  var inputValue = document.querySelector('.inputValue')
  var name = document.querySelector('.name');
  var desc = document.querySelector('.desc');
  var temp = document.querySelector('.temp');

  button.addEventListener('click',function(){
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' +inputValue.value+ '&appid=5a3fce08c6a82b355fcf4d817eefb65b&units=metric')
    .then(response => response.json())
    .then(data => {
      var nameValue = data['name'];
      var tempValue = data['main']['temp'] + '&#176;C';
      var descValue = data['weather'][0]['description'];

      name.innerHTML = nameValue;
      temp.innerHTML = tempValue;
      desc.innerHTML = descValue;
    })



  .catch(err => alert("Wrong city name!"))
  })
}

textfield();




function map() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZGVuaXNlMDUiLCJhIjoiY2s4azUwcmx4MGpweDNkcWhndW05enY3dSJ9.wNo6Q6BGyEKBa7T6oNJXxg';

  // Initiate map
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',

    // Positioning the map on a certain longitute + latitude and zooming in
    center: [5.01667, 47.31667],
    zoom: 3
  });

  var cities = [
    {
      name: 'Amsterdam',
      coordinates: [4.895168, 52.370216]
    },
    {
      name: 'Berlijn',
      coordinates: [13.404954, 52.520008]
    },
    {
      name: 'Parijs',
      coordinates: [2.352222, 48.856613]
    },
    {
      name: 'Londen',
      coordinates: [-0.127758, 51.507351]
    },
    {
      name: 'Rome',
      coordinates: [12.496365, 41.902782]
    },
    {
      name: 'Madrid',
      coordinates: [-3.703790, 40.416775]
    },
  ];

  var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
  var openWeatherMapUrlApiKey = '5a3fce08c6a82b355fcf4d817eefb65b';

  map.on('load', function () {
    cities.forEach(function(city) {
      // Usually you do not want to call an api multiple times, but in this case we have to
      // because the openWeatherMap API does not allow multiple lat lon coords in one request.
      var request = openWeatherMapUrl + '?' + 'appid=' + openWeatherMapUrlApiKey + '&lon=' + city.coordinates[0] + '&lat=' + city.coordinates[1];

      // Get current weather based on cities' coordinates
      fetch(request)
        .then(function(response) {
          if(!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then(function(response) {
          // Then plot the weather response + icon on MapBox
          plotImageOnMap(response.weather[0].icon, city)
        })
        .catch(function (error) {
          console.log('ERROR:', error);
        });
    });
  });

function plotImageOnMap(icon, city) {
    map.loadImage(
      'http://openweathermap.org/img/w/' + icon + '.png',
      function (error, image) {
        if (error) throw error;
        map.addImage("weatherIcon_" + city.name, image);
        map.addSource("point_" + city.name, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: city.coordinates
              }
            }]
          }
        });
        map.addLayer({
          id: "points_" + city.name,
          type: "symbol",
          source: "point_" + city.name,
          layout: {
            "icon-image": "weatherIcon_" + city.name,
            "icon-size": 1.3
          }
        });
      }
    );
  }
}

map();




