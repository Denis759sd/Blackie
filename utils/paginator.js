const axios = require('axios')
const jsdom = require('jsdom')
const path = require('path')
const { downloadFile } = require('./downloadFile')
const filters = require('../filters.json')

const { JSDOM } = jsdom

let isParse = false
let cars = []

const paginator = (chatId, bot) => {
    if (isParse) {
        axios.get(`https://cars.av.by/filter?brands['${filters.brand}'][brand]=6&year[min]=${filters.minYear}&year[max]=${filters.maxYear}&page=${filters.page}`).then(response => {
            let currentPage = response.data
            const dom = new JSDOM(currentPage)

            let items = dom.window.document.getElementsByClassName('listing__items')[0].getElementsByClassName('listing-item')
            let linksLength = items.length

            for (let i = 0; i < linksLength; i++) {
                let carTitle = items[i].getElementsByClassName('listing-item__wrap')[0]
                    .getElementsByClassName('listing-item__about')[0].getElementsByClassName('listing-item__title')[0]
                    .getElementsByTagName('a')[0].getElementsByTagName('span')[0].outerHTML

                carTitle = carTitle.replace(/   /g, ' ').replace('<span class="link-text">', '')
                    .replace(/<!-- -->/gi, '').replace(/<\/span>/g, '').replace(/&nbsp;/, '')

                let carPrice = items[i].getElementsByClassName('listing-item__wrap')[0]
                    .getElementsByClassName('listing-item__prices')[0].getElementsByClassName('listing-item__priceusd')[0].outerHTML

                carPrice = carPrice.replace('<div class="listing-item__priceusd">≈&nbsp;', '').replace('&nbsp;$</div>', '')

                let carParams = items[i].getElementsByClassName('listing-item__wrap')[0]
                    .getElementsByClassName('listing-item__params')[0].outerHTML
                carParams = carParams.replace(/<div class="listing-item__params"><div>/g, '')
                    .replace(/<div>/g, '').replace(/<div>/g, '').replace(/nbsp;/g, '')
                    .replace(/<\/div>/g, '').replace(/<!-- -->/g, '').replace(/<span>/g, ' ').replace(/<\/span>/g, '')
                    .replace(/&/g, '').replace(/,/g, '')

                carParams = carParams.split(' ')
                console.log(carParams)

                let carPhoto = items[i].getElementsByClassName('listing-item__wrap')[0]
                    .getElementsByClassName('listing-item__photo')[0].getElementsByTagName('img')[0].getAttribute('data-src')

                const path = downloadFile(carPhoto, (carPhoto.replace(/\//g,'').replace(/https:/, '')))

                cars.push({
                    title: carTitle,
                    price: carPrice,
                    photo: path,
                    params: carParams
                })
            }
            return cars
        }).then(result => {
            let index = 0
            const sendResult = () => setInterval(() => {
                for (let i = index; i < result.length; i++) {
                    const message = `${result[i]['title'].toString()} \nЦена: ${result[i]['price'].toString()}$ \n\n${result[i]['params'][0]}\n${result[i]['params'][1]}\n${result[i]['params'][2]}\n${result[i]['params'][3]}\n${result[i]['params'][4]}\n`

                    result[i]['photo'].then(fileName => {
                        console.log(__dirname + '..');
                        bot.sendPhoto(chatId, path.resolve(__dirname.replace(/utils/, ''), fileName), {caption: message})
                        return
                    })
                    index++
                    return
                }
                clearInterval(sendResult)
            }, 5000)

            if (index < result.length) {
                sendResult()
            }

            if (index > result.length) {
                filters.page++
                sendResult()
            }
        })
    }
}

const stopParse = () => {
    isParse = false
}

const startParse = (chatId, bot) => {
    isParse = true
    paginator(chatId, bot)
}

exports.startParse = startParse
exports.stopParse = stopParse