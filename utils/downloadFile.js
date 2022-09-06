const util = require('util')
const axios = require('axios')
const stream = require('stream')
const pipeline = util.promisify(stream.pipeline)
const fs = require('fs')
const path = require('path')

const downloadFile = async (uri, fileName) => {
  try {
    fs.readdirSync('cars').forEach(f => fs.rmSync(`cars/${f}`))

    const request = await axios.get(uri, {
      responseType: 'stream',
    });

    const path = `cars/${fileName}`

    await pipeline(request.data, fs.createWriteStream(path))
    console.log('download png pipeline successful') 
    return path
  } catch (error) {
    console.error('download png pipeline failed', error)
  }
}

exports.downloadFile = downloadFile