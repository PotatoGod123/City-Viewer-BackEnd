'use strict';
//require dependecies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');


//global variable
//this is a flag trigger,used in locationFunction and weatherFunction
let flagTrigger = false;

//using dependecies and setting up server
const app = express();
const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL);


app.use(cors());

app.get('/', rootRequest);

app.get('/location', locationFunction);

app.get('/weather', weatherFunction);

app.get('/movies', moviesFunction);

app.use('*', catchAllRequest);
//function handlers
//testing server
function rootRequest(request, response) {
  response.send('hello world');
}
function catchAllRequest(request, response) {
  response.status(404).send('404, sowwrryyyyyy');
}

//this funciont  will get location data when requested
function locationFunction(request, response) {
  const city = request.query.city;
  let key = process.env.GEODUDE_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  if (city === '' || city === ' ') {
    invalidInput(response);
  } else {
    checkForDatabaseLocation(city, response, url);
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
      .then(promise => {
        const dataTest = promise.body.data.map(val => {
          return new WeatherInfo(val);
        });
        response.status(200).send(dataTest);
      }).catch(error => {
        console.log(error);
      });
  }
}

//this one sends the movies data from API


function moviesFunction(request, response) {
  const key = process.env.MOVIES_API_KEY;

  
  //the query filters
  const queryObj = {
    api_key : key,
    query : request.query.search_query,
    include_adult: false
  };

  
  const url = 'https://api.themoviedb.org/3/search/movie';

  if (flagTrigger) {
    invalidInput(response);
  } else {
    superagent.get(url)
      .query(queryObj)
      .then( data =>{
        const dataHolder = data.body.results;
        if(dataHolder>20){
          dataHolder.length = 20;
        }
        const movieHolder = dataHolder.map(val=>{
          return new MovieInfo(val);
        });

        response.status(200).send(movieHolder);
      }).catch(error=>{
        console.log(error);
      });
  }



}

//these will be a helper functions
function invalidInput(send) {
  flagTrigger = true;
  return send.status(500).send('Sorry, something went wrong');
}

function checkForDatabaseLocation(city, response, url) {
  const firstSQL = `SELECT * FROM location WHERE search_query LIKE '${city}'`;
  const secondSQL = 'INSERT INTO location (search_query,formattedquery,latitude,longitude) VALUES ($1,$2,$3,$4)';

  client.query(firstSQL)
    .then(data => {
      if (data.rowCount === 0) {
        superagent.get(url)
          .then(data => {
            const newLocationInstance = new Location(city, data.body[0]);
            const safeQuery = [newLocationInstance.search_query, newLocationInstance.formatted_query, newLocationInstance.latitude, newLocationInstance.longitude];
            client.query(secondSQL, safeQuery);
            return response.status(200).json(newLocationInstance);
          }).catch(error => {
            console.log(error);
          });
      } else if (data.rowCount === 1) {
        console.log(`${data}location data from database is working`);
        return response.status(200).json(data.rows[0]);
      }
    }).catch(error => {
      console.log(error);
    });



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

function MovieInfo(data){
  this.title = data.original_title;
  this.overview = data.overview;
  this.average_votes = data.vote_average;
  this.total_votes = data.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  this.popularity = data.popularity;
  this.released_on = data.release_date;
}

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`now listening on port,${PORT}`);
      console.log(`Connected to database ${client.connectionParameters.database}`);
    });
  })
  .catch(error => {
    console.log(error);
  });
