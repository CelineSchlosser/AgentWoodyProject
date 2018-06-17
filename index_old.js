'use strict';

const functions = require('firebase-functions');
// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  Permission,
} = require('actions-on-google');

const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
  conv.ask(new Permission({
    context: 'Hi there, to get to know you better',
    permissions: ['NAME', 'DEVICE_COARSE_LOCATION']
  }));
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    conv.data.userName = conv.user.name.given;
    let msg = `Thanks, ${conv.data.userName}. please tell me your xxx gender, age and zip code.`;
    //msg += ' ' + JSON.stringify(conv);
  //  Object.keys(conv.device.location).map(k => msg += ' ' + k);

    conv.ask(msg);
});

//Call function
 app.intent('my_insurance_cover', (conv, {age, gender}) => {
  conv.close(`Alright, your silly name is ${age} you age ${gender}`);
});



exports.ZurichInsurance = functions.https.onRequest(app);
