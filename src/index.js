const _ = require('lodash');
const alexa = require('alexa-app');
const axios = require("axios");
const conf = require('./data/config.json');

const ax = axios.create({
  baseURL: 'https://api.everyblock.com/',
  headers: {'Authorization': conf.secret.Auth} // you will need to add your own config file and token here
});

const app = new alexa.app();
app.launch((request, response) => {
  response.say("Block party is ready to give you info about your hood.  What would you like to know?").send();
  // if this is an async handler you must return false
  //return false;
});

app.intent("GetEvents", (request, response) => {
    var city = request.slot('City');
    var txt = 'It seems like the city of '+city+' is going to have a lovely weekend';
    return response.say(txt);
  }
);

app.intent("GetNews", (request, response) => {
    response.say("Whats going on in your hood is amazing.");
  }
);

// connect to lambda
exports.handler = app.lambda();