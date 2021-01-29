# Apple Stock Checker

## About
This is a serverless (Azure Functions) application for checking stock of a product on Apple's online shop. Once the product appears to have stock online, an SMS message will be sent to the specified phone numbers alerting that the product is buyable.

## Prerequisites
 - [Azure Function Core Tools](https://github.com/Azure/azure-functions-core-tools) 
 - [Azure Storage Emulator](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-emulator) 
 - [NodeJs LTS](https://nodejs.org/) 
 - [Twilio Account (for SMS)](https://www.twilio.com/) 

## Installation (Local)
 - Install Prerequisites
 - Clone repo: `git clone https://github.com/omgitsfrancis/apple-stock-checker`
 - Navigate to repo directory: `cd apple-stock-checker`
 - Install node dependancies: `npm install`
 - Create local.settings.json file using example.settings.json: `cp example.settings.json local.settings.json`
 - In local.settings.json file fill in the following variables:
    - SendTextApiKey - Leave blank. Needed only when deployed to Azure
    - ProductId: Apple shop product ID that will be queried (This can be found in the URL of an apple product) - ex: "MU8F2AM/A", MU8F2AM/A
    - TwilioAccountSid: Twilio Account SID
    - TwilioAuthToken: Twilio Auth Token
    - PhoneNumbers: comma seperated list of phone numbers (with country code) to recieve SMS notification - ex: "+15555555555,+16666666666"
 - Run locally: `npm start`


