'use strict';
//require dependecies
require('dotenv').config();
const express= require('express');
const cors = require('cors');
//global variable
//this is a flag trigger,used in locationFunction and weatherFunction
let flagTrigger = false;

//using dependecies and setting up server
const app = express();
const PORT= process.env.PORT;
app.use(cors());

app.get('/',rootRequest);

app.get('/location', locationFunction);

app.get('/weather', weatherFunction);

app.use('*',catchAllRequest);
//function handlers
//testing server
function rootRequest(request, response){
  response.send('hello world');
}
function catchAllRequest(request,response){
  response.send('404, sowwrryyyyyy');
}

//this funciont  will get location data when requested
function locationFunction(request, response){
  const data= require('./data/location.json');
  const city= request.query.city;
  const locationData = new Location(city,data);
  if(city==="" || city===" "){
    response.send(invalidInput());
    flagTrigger = true;
  }else{
    response.send(locationData);
  }
}

//this function will send back weather information
function weatherFunction(request,response){
  const data= require('./data/weather.json');
  const weatherHolderArray= [];
  data.data.forEach(val =>{
    weatherHolderArray.push(new WeatherInfo(val));
  });
  if(flagTrigger){
    response.send(invalidInput());
  }else{
    response.send(weatherHolderArray);
  }
}
//this will a helper function for above
function invalidInput(){
  const errorArray = {
    status:'500',
    responseText: 'Sorry, something went wrong',
  };
  return errorArray;
}
//constructors

function Location(city,data){
  this.search_query = city;
  this.formatted_query= data[0].display_name;
  this.latitude = data[0].lat;
  this.longitude = data[0].lon;
}

function WeatherInfo(data){
  this.forecast = data.weather.description;
  this.time =data.valid_date;
}


app.listen(PORT, ()=>{
  console.log(`now listening on port,${PORT}`);
});
