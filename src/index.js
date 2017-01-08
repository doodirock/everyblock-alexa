const _ = require('lodash');
const alexa = require('alexa-app');
const axios = require("axios");
const conf = require('./data/config.json'); // Used to store secret tokens and other things you want to hide

const ax = axios.create({
  baseURL: 'https://api.everyblock.com/',
  headers: {'Authorization': conf.secret.Auth} // you will need to add your own secret token here
});

const app = new alexa.app();
app.launch((request, response) => {
  response.say("Block party is ready to give you info about your hood.  What would you like to know?").send();
  // if this is an async handler you must return false
  //return false;
});

app.intent("GetEvents", (request, response) => {
    
    var city = request.slot('City');
    console.log(city);

    ax.get('content/chicago/topnews/.json')
      .then(function (data) {
        response.say('Hey it worked! I can now return a response from the API');
        response.send();
      })
      .catch(function (error) {
        response.say('Hey it broke!');
        response.send();
      });  
    return false;
  }
);

app.intent("GetNews", (request, response) => {
    response.say("Whats going on in your hood is amazing.");
  }
);

// connect to lambda
exports.handler = app.lambda();