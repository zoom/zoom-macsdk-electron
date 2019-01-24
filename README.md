# Zoom Electron SDK on MacOS

> Our brand new [Zoom Developer Community Forum](https://devforum.zoom.us/) is now online!!! Check it out! We are here to help! :D

## Disclaimer

**Please be aware that all hard-coded variables and constants shown in the documentation and in the demo, such as Zoom Token, Zoom Access, Token, etc., are ONLY FOR DEMO AND TESTING PURPOSES. We STRONGLY DISCOURAGE the way of HARDCODING any Zoom Credentials (username, password, API Keys & secrets, SDK keys & secrets, etc.) or any Personal Identifiable Information (PII) inside your application. WE DON’T MAKE ANY COMMITMENTS ABOUT ANY LOSS CAUSED BY HARD-CODING CREDENTIALS OR SENSITIVE INFORMATION INSIDE YOUR APP WHEN DEVELOPING WITH OUR SDK**.

## Getting Started

The following instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
* For detailed instructions, please refer to our documentation website: [https://marketplace.zoom.us/docs/sdk/electron-support](https://marketplace.zoom.us/docs/sdk/electron-support);
* If you need support or assistance, please visit our [Zoom Developer Community Forum](https://devforum.zoom.us/);

### Prerequisites

Before you try out our SDK, you would need the following to get started:

* **A Zoom Account**: If you do not have one, you can sign up at [https://zoom.us/signup](https://zoom.us/signup).
  * Once you have your Zoom Account, sign up for a 60-days free trial at [https://marketplace.zoom.us/](https://marketplace.zoom.us/)
* **A device with Mac OS**:
  * OS: MacOS 10.6 or later.


### Installing

Clone or download a copy of our SDK files from GitHub. After you unzipped the file, you should have the following folders:

```
.
├── CHANGELOG.md
├── LICENSE.md
├── README.md
├── bin
├── h
├── lib
├── [sdk_demo] <-- demo app is inside
└── version.txt
```
Please refer to the following steps to install and compile:

1. Install brew

command:
```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

2. Install npm and Node.js. Make sure the Node.js version is v8.12.0 (Carbon) or older

3. Get Electron release package and unzip. Rename package_mac.json to package.json in lib folder.

4. Get the released SDK package. Copy ZoomSDK folder to Electron SDK folder at the same level as the demo folder.

5. cd /demo, run "npm install" to install SDK

6. Run "npm start" to start demo

7. Run "npm run-script packager" to package app


## Documentation

Please visit [[https://marketplace.zoom.us/docs/sdk/electron-support](https://marketplace.zoom.us/docs/sdk/electron-support)] for details of each features and functions.

## Versioning

For the versions available, see the [tags on this repository](https://github.com/zoom/zoom-macsdk-electron/tags).

## Change log

Please refer to our [CHANGELOG](https://github.com/zoom/zoom-macsdk-electron/blob/master/CHANGELOG.md) for all changes.

## Frequently Asked Questions (FAQ)

* :one: `Error: Module version mismatch. Expected 50, got 57.at Error (native)`:
  * Our Electron SDK requires Node.js version 8.12.0 and if you have higher version, you will get this error message. Using Node.js 8.12.0 will resolve this problem.
* Not finding what you want? We are here to help! Please visit our [Zoom Developer Community Forum](https://devforum.zoom.us/) for further assistance.

## Support

For any issues regarding our SDK, please visit our new Community Support Forum at https://devforum.zoom.us/.

## License

Use of this software is subject to important terms and conditions as set forth in the License file

Please refer to [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* :star: If you like our SDK, please give us a "Star". Your support is what keeps us moving forward and delivering happiness to you! Thanks a million! :smiley:
* If you need any support or assistance, we are here to help you: [Zoom Developer Community Forum](https://devforum.zoom.us/);

---
Copyright ©2019 Zoom Video Communications, Inc. All rights reserved.
