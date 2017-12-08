const os = require('os');
const path = require('path');
const globals = require('./globals');

const CHROME_DRIVER_PATH =  require('chromedriver').path;
const SELENIUM_DRIVER_PATH = require('selenium-server-standalone-jar').path;

module.exports = {
  src_folders : [path.resolve(__dirname, './specs')],
  output_folder : globals.reportsDir,
  custom_commands_path : path.resolve(__dirname, './commands'),
  page_objects_path : path.resolve(__dirname, './pages'),
  persist_globals: true,
  globals_path: path.resolve(__dirname, './globals'),
  screenshots: {
    enabled: true,
    on_failure: true,
    on_error: true,
    path: globals.screenshotsDir
  },
  "selenium" : {
    start_process: true,
    server_path: SELENIUM_DRIVER_PATH,
    port: 4444,
    cli_args: {
      'webdriver.gecko.driver': CHROME_DRIVER_PATH,
      'webdriver.chrome.driver': CHROME_DRIVER_PATH,
      'webdriver.safari.driver' : '/usr/bin/safaridriver'
    }
  },
  "test_settings" : {
    "default" : {
      "launch_url" : globals.baseUrl,
      "selenium_port"  : 4444,
      "silent": true,
      "screenshots" : {
        "enabled" : false,
        "path" : ""
      },
      "desiredCapabilities": {
        "browserName": "chrome"
      }
    },

    "firefox" : {
      "desiredCapabilities": {
        "browserName": "firefox",
        "marionette": true
      }
    },

    "edge" : {
      "desiredCapabilities": {
        "browserName": "MicrosoftEdge"
      }
    }
  }
};
