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
    var txt = '';

    ax.get('content/'+city+'/topnews/.json')
      .then((data) => {
         response.say('Hey it worked!');
      })
      .catch((error) => {
        response.say('Sorry there seems to be an issue');
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