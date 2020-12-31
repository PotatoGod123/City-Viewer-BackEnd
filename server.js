'use strict';
//require dependecies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
//global variable
//this is a flag trigger,used in locationFunction and weatherFunction
let flagTrigger = false;

//using dependecies and setting up server
const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.get('/', rootRequest);

app.get('/location', locationFunction);

app.get('/weather', weatherFunction);

app.use('*', catchAllRequest);
//function handlers
//testing server
function rootRequest(request, response) {
  response.send('hello world');
}
function catchAllRequest(request, response) {
  response.send('404, sowwrryyyyyy');
}

//this funciont  will get location data when requested
function locationFunction(request, response) {
  const city = request.query.city;
  let key = process.env.GEODUDE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

  if (city === '' || city === ' ') {
    invalidInput(response);
  } else {
    superagent.get(url)
      .then(data => {
        response.send(new Location(city, data.body[0]));
      });
    flagTrigger = false;
  }
}

//this function will send back weather information
function weatherFunction(request, response) {
  const key = process.env.WEATHER_API_KEY;
  const lat = request.query.latitude;
  const lon = request.query.longitude;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${key}`;

  if (flagTrigger) {
    invalidInput(response);
  } else {
    superagent.get(url)
      .then(promise=>{
        const dataTest = promise.body.data.map(val => {
          return new WeatherInfo(val);
        });
        response.send(dataTest);
      });
  }
}
//this will a helper function for above
function invalidInput(send) {
  flagTrigger = true;
  return send.status(500).send('Sorry, something went wrong');
}
//constructors

function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data.display_name;
  this.latitude = data.lat;
  this.longitude = data.lon;
}

function WeatherInfo(data) {
  this.forecast = data.weather.description;
  this.time = new Date(data.valid_date).toDateString();
}


app.listen(PORT, () => {
  console.log(`now listening on port,${PORT}`);
});
