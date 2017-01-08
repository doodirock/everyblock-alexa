const logger = require('tracer').console();
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

    ax.get('content/'+city.toLowerCase()+'/topnews/.json')
      .then(function (complete) {
        var events = complete.data.results;
        var listOfcrimes = events.map(function (x) {
            return x.title.split(',')[0]
        });
        logger.log(listOfcrimes);
        response.say(listOfcrimes[0]);
        response.send();
      })
      .catch(function (error) {
        console.log(error);
        response.say('Something has gone very wrong.  Try saying, Alexa Ask Block Party what is going on in my city');
        response.send();
      });  
    return false;
  }
);

app.intent("GetNews", (request, response) => {
    response.say("Whats going on in your hood is amazing.");
  }
);

app.error = (exception, request, response) => {
    console.log('Alex global error handler', exception);
    response.say('Sorry, something bad happened and there is no way to recover.  OH THE HUMANITY');
    response.send();
};

// connect to lambda
exports.handler = app.lambda();