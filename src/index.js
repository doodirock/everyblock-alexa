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
  request.getSession();
  response.say("Block party is ready to give you info about your hood.  What would you like to know?").send();  
  response.shouldEndSession(false);  
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
              var list = '';
              if (type === 'crime') {
                list = x.title+'<break time="1s"/> Located at <say-as interpret-as="address">'+x.location_name+'</say-as><break time="2s"/>';
              } else {
                list = x.title+'<break time="1s"/>'+x.attributes.comment+'<break time="2s"/>';
              }
              return list.replace(/[&]/g, "");
          });
          var final = listOfstuff.slice(0,5).toString();
          response.say('<speak>Here is your '+type+' top 5 report for '+city+' <break time="2s"/>.');
          response.say(final);
          response.say('</speak>');
          response.card({
            type: 'Simple',
            title: 'Your '+type+' Report for '+city+'', // this is not required for type Simple
            content: 'Check out http://chicago.everyblock.com/'+type+'/, for more information.'
          });           
          response.send();         
        } else {
          response.say('<speak>Sorry, but there does not seem to be any reports about '+type+' in this area.');
          response.send();          
        }
      })
      .catch(function (error) {
        console.log(error);
        response.say('We seems to have encountered an error look for your report, can you please ask again?');
        response.send();
      });  
    return false;
  }
);

app.intent("AMAZON.HelpIntent", (request, response) => {
    response.say('<p>You can request reports from several different topics in your neighborhood.</p>'
    +'<p>These topics include, crime, meetups, announcements, pets, improvements, politics, housing, family, events, and kindness</p>'
    +'<p>For example you can ask Block Party, What are people saying about crime in Chicago, or, tell me about pets in Boston.</p>'
    );
  }
);

app.intent("AMAZON.StopIntent", (request, response) => {
    response.say('<p>Shutting down Block Party.  Good bye!</p>');
  }
);

app.error = (exception, request, response) => {
    console.log('Alex global error handler', exception);
    response.say('Sorry, something bad happened and there is no way to recover.  OH THE HUMANITY');
    response.send();
};

// connect to lambda
exports.handler = app.lambda();