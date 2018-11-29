# ZoomSDKElectron

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

## Support

For any issues regarding our SDK, please visit our new Community Support Forum at https://devforum.zoom.us/.