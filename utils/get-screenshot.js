const path = require('path')
const screenshot = require('screenshot-desktop')

const getScreenshot = () => screenshot.listDisplays().then((displays) => {
    console.log(displays);
  
    console.log(displays[displays.length - 1].id);

    screenshot({ screen: displays[displays.length - 1].id, filename: path.resolve(__dirname.replace(/utils/, ''), 'screenshots/shot.jpg') })
    console.log(__dirname);
})

exports.getScreenshot = getScreenshot

