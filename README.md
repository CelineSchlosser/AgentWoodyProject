# Agent Woody
Agent Woody is an insurance agent which is at your disposal 24/7 and instantly via Google Assistant. Agent Woody recommends a bundle of protection to you based on a predictive model which requires only a hints from you. You can still deviate from the proposed configuration, and ultimately get the protection directly.

## Building the app
1. Create the predictive model by running model_cover_bundle.R. Change the path to inlclude the data  Sample data.xlsx from Excel.
2. Create a Google Action and Dialogflow project. Import the ZurichInsuranceDialogflow.zip into Dialogflow.
3. Create a Google Web Functions with Firebase (index.js, package.json, recommender_model.json)

Try Ok Google, talk to Agent Woody.
