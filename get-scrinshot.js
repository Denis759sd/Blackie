const fs = require('fs')
const screenshot = require('screenshot-desktop');

const getScreenshot = () => screenshot.listDisplays().then((displays) => {
    console.log(displays);
  
    console.log(displays[displays.length - 1].id);

    screenshot({ screen: displays[displays.length - 1].id, filename: __dirname + '/screenshots/shot.jpg' })
})

exports.getScreenshot = getScreenshot

