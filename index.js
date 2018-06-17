'use strict';

const fs = require('fs');

var price;

function getProductRecommendation(has_mf_, has_hh_, has_pl_, has_as_){

    var message = "Our personalized proposal contains the following ";

    const nbr_covers = (has_mf_ ? 1 : 0) + (has_hh_ ? 1 : 0) + (has_pl_ ? 1 : 0) + (has_as_ ? 1 : 0);

    price = (has_mf_ ? 800 : 0) + (has_hh_ ? 100 : 0) + (has_pl_ ? 50 : 0) + (has_as_ ? 60 : 0);

    var message_add_on = " protection";
    if(nbr_covers > 1){
        message_add_on = " " + nbr_covers + " protections";
    }

     message = message + message_add_on + ":\n";
    if(has_hh_ == true){
        message = message + "Home protection, to cover your belongings. \n";
    }
    if(has_pl_ == true){
        message = message + "Device protection, so you can replace your devices instantly. \n";
    }
    if(has_as_ == true){
        message = message + "Travel protection, for your adventures all over the world. \n";
    }
    if(has_mf_ == true){
        message = message + "Car protection, to relax whenever you are on the road. \n";
    }

    if(has_mf_ == false && has_hh_ == false && has_pl_ == false && has_as_ == false){
        message =  'It seems you do not need any protection. \n';
    }

    return message + " We can offer you this for USD " + price + ".\n  How does that sound for you?";

}



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
    context: 'Hi, to help you best',
    permissions: ['NAME', 'DEVICE_COARSE_LOCATION']
  }));
});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    conv.data.userName = conv.user.name.given;
    let msg = `Thanks, ${conv.data.userName}. How can I help you?`;
    //msg += ' ' + JSON.stringify(conv);
  //  Object.keys(conv.device.location).map(k => msg += ' ' + k);

    conv.ask(msg);
});

//Call function
//  conv.close(`Alright, your silly name is ${age} you age ${gender}`);
//});


// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('my_insurance_cover', (conv, {number, gender}) => {
    //const gender_premium = gender === 'female' ? 1.2 : 1.5;

    //var premium = gender_premium * number * 100;
    // Respond with the user's lucky number and end the conversation.
    //conv.ask('I understand you are ' + number + ' years old, you live in Zurich and you are '+ gender +
    //'. Customers like you usually buy the following protection: Are you interested?');
    var age = number;

    var data=fs.readFileSync('./recommender_model.json', 'utf8');
    var model=JSON.parse(data);


    var has_mf = false;
    var has_hh = false;
    var has_pl = false;
    var has_as = false;

    //var age = Math.floor(Math.random() * 70);
    var age_band;
    //var gender = "Male";
    //if(Math.random() > 0.5){
    //    gender = "Female";
    //}


    if(age <= 25){
        age_band = "(-Inf,25]";
    }
    if(age > 25 && age <= 45){
        age_band = "(25,45]";
    }
    if(age > 45 && age <= 55){
        age_band = "(45,55]";
    }
    if(age > 55){
        age_band = "(55, Inf]";
    }
      const result = model.filter(item => item.AGE_BAND === age_band && item.Gender === gender);
    has_mf = result[0].MF_IND;
    has_hh = result[0].HH_IND;
    has_pl = result[0].PL_IND;
    has_as = result[0].AS_IND;

    conv.ask(getProductRecommendation(has_mf, has_hh, has_pl, has_as));
});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
//app.intent('my_insurance_final', (conv, {answer}) => {
  //  if(answer == "Yes"){
    //  conv.close("Great. This is an excellent choice. Please enter your credit card details.")
  //  }else{
  //    conv.ask("What do you want to change?")
  //  }
//});

app.intent('my_insurance_final_changed', (conv, {insoption, instype}) => {
    if(instype == 'car'){
      var pricereduction = 500;
    }else{
      var pricereduction = 200;
    }

    if(insoption == 'exclude' && instype == 'car'){
        var price_new = price - pricereduction;
        conv.ask("Sweet. We excluded your " + instype + " insurance. Your new price would be " + price_new +
      " USD. Does this suit you better?") //_new + " USD")
    }else if(insoption == "include"){
       conv.ask("Great. We love to protect everything you love. Please enter your payment details.")
    }
});

app.intent('my_insurance_final_changed_final', (conv, {answer}) => {
      if(answer == "Yes"){
        conv.close("Great. We love to protect everything you love. Please enter your payment details")
      }
});




exports.ZurichInsurance = functions.https.onRequest(app);
