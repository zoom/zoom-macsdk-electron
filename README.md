# ZoomSDKElectron

This is a basic version to support Electron framework on Mac. 

Please use the following steps to get the sample app setup and running.

1. Install Brew

curl -LsSf http://github.com/mxcl/homebrew/tarball/master | sudo tar xvz -C/usr/local --strip 1

2. Install npm and Node.js

brew install node

3. Install Electron

 i: sudo npm install -g electron --unsafe-perm=true

 	cd /usr/local/lib/node_modules/electron

 ii: npm install nodobjc

 iii: npm install --save-dev electron-rebuild

 iv: ./node_modules/.bin/electron-rebuild

 v: npm rebuild --runtime=electron --target=1.7.9 --disturl=https://atom.io/download/atom-shell --build-from-source

 To Run it:

 1. Make sure u have installed Electron successfully.

 2. Get Electron release package contains three zip: Demo_*, Lib_*, mac_sdk_* 
 	
 	Demo_*:  the Electron demo 

	Lib_*: JS files that make the bridge from JS to ObjectC

	mac_sdk_*:  Zoom Mac SDK ObjectC libs.

3. unzip the three zips above, will show three folders: /demo, /lib, /ZoomSDK

1) copy the node_modules folder located in /usr/local/lib/node_modules/electron/node_modules to /demo

2) copy folder /ZoomSDK to both /node_modules folder

3) copy all libs contained in /ZoomSDK to  /usr/local/lib/node_modules/electron/dist/Electron.app/Content/Frameworks folder

4) cd /demo folder and run command  "electron ."