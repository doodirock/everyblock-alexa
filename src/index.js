const _ = require('lodash');
const alexa = require('alexa-app');
const axios = require("axios");

const ax = axios.create({
  baseURL: 'https://some-domain.com/api/'
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