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
    var type = request.slot('Type');

    ax.get('content/'+city.toLowerCase()+'/topnews/.json?schema='+type)
      .then(function (complete) {
        var events = complete.data.results;
        if (events.length > 1) {
          var listOfstuff = events.map(function (x) {
              var list = x.title+'<break time="1s"/>'+x.attributes.comment+'<break time="2s"/>';
              return list.replace(/[&]/g, "");
          });
          logger.log(listOfstuff);
          var final = listOfstuff.slice(0,5).toString();
          response.say('<speak>Here is your '+type+' top 5 report for '+city+' <break time="2s"/>.');
          response.say(final);
          response.say('</speak>');
          response.send();
        } else {
          response.say('<speak>Sorry, but there does not seem to be any reports about '+type+' in this area.');
          response.send();          
        }
      })
      .catch(function (error) {
        console.log(error);
        response.say('status bad');
        response.send();
      });  
    return false;
  }
);

app.error = (exception, request, response) => {
    console.log('Alex global error handler', exception);
    response.say('Sorry, something bad happened and there is no way to recover.  OH THE HUMANITY');
    response.send();
};

// Helpers

// function renderResponse(awsResponse) {
//     awsResponse.say('</speak>');
//     awsResponse.response.response.outputSpeech.type = 'SSML';
//     awsResponse.response.response.outputSpeech.ssml = awsResponse.response.response.outputSpeech.text;
//     awsResponse.send();
// }

// connect to lambda
exports.handler = app.lambda();