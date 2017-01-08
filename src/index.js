const _ = require('lodash');
const alexa = require('alexa-app');
const Blue = require("bluebird");

const app = new alexa.app();
app.launch((request, response) => {
  response.say("Block party is ready to give you info about your hood.  What would you like to know?").send();
  // if this is an async handler you must return false
  //return false;
});

app.intent("GetEvents", (request, response) => {
    response.say("Chicago streets for days.");
  }
);

app.intent("GetNews", (request, response) => {
    response.say("Whats going on in your hood is amazing.");
  }
);

// connect to lambda
exports.handler = app.lambda();