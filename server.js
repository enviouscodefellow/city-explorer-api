'use strict';

console.log('Proof of life');

// REQUIRES (for backend on servers; should go at very top)
const express = require('express');
require('dotenv').config();
let data = require('./data/weather.json');
const cors = require('cors');

// ONCE EXPRESS IS IN WE NEED TO USE IT
// APP === SERVER

const app = express();

//middleware to share resources across the net
app.use(cors());

// DEFINE PORT

const PORT = process.env.PORT || 3002;
//3002 - if server is up on 3002, then I know there is something wrong with my .env file or i didn't bring in the dotenv library (npm i dotenv) OR port 3001 is already being used.

// npx kill-port 3001 if there is a nodemon error

// ENDPOINTS

//BASE ENDPOINT - SHOULD ALWAYS BEFORE CATCH-ALL

app.get('/', (request, response) => {
  console.log('This app.get is in terminal');
  response.status(200).send('Welcome to the jungle baby.');
});

app.get('/hello', (request, response) => {
  console.log(request.query);
  let firstName = request.query.firstName;
  let lastName = request.query.lastName;
  response.status(200).send(`How did you get here ${firstName} ${lastName}?`);
});

app.get('/weather', (request, response, next) => {
  console.log(request);
  let lat = request.query.lat;
  console.log(lat);
  let lon = request.query.lon;
  console.log(lon);
  let cityName = request.query.cityName;
  console.log(cityName);

  try {
    let cityToGroom = data.find((city) => city.city_name === cityName);
    let groomedData = cityToGroom.data.map((day) => new Forecast(day));
    response.status(200).send(groomedData);

  } catch (error) {
    next(error);
  }
});

class Forecast {
  constructor(weatherObj) {
    this.date = weatherObj.valid_date;
    this.desc = weatherObj.weather.description;
  }
}

//CATCH-ALL AND SHOULD LIVE AT THE BOTTOM
app.get('*', (request, response) => {
  response.status(404).send(`These aren't the droids you're looking for`);
});

// ERROR HANDLING
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// SERVER START
app.listen(PORT, () => console.log(`We are up and running on port ${PORT}.`));
