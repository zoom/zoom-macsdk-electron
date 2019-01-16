# Zoom SDK Electron on Mac OS

This is a basic version to support Electron framework on Mac. 

Please follow the following steps to setup and run the sample app.

1. Install brew

command: ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

2. Install npm and Node.js. Make sure the Node.js version is v8.12.0 (Carbon) or older

3. Get Electron release package and unzip. Rename package_mac.json to package.json in lib folder.

4. Get the released SDK package. Copy ZoomSDK folder to Electron SDK folder at the same level as the demo folder.

5. cd /demo, run "npm install" to install SDK

6. Run "npm start" to start demo

7. Run "npm run-script packager" to package app

## Disclaimer

**Please be aware that all hard-coded variables and constants shown in the documentation and in the demo, such as Zoom Token, Zoom Access, Token, etc., are ONLY FOR DEMO AND TESTING PURPOSES. We STRONGLY DISCOURAGE the way of HARDCODING any Zoom Credentials (username, password, API Keys & secrets, SDK keys & secrets, etc.) or any Personal Identifiable Information (PII) inside your application. WE DON’T MAKE ANY COMMITMENTS ABOUT ANY LOSS CAUSED BY HARD-CODING CREDENTIALS OR SENSITIVE INFORMATION INSIDE YOUR APP WHEN DEVELOPING WITH OUR SDK**.

## Support

For any issues regarding our SDK, please visit our new Community Support Forum at https://devforum.zoom.us/.
