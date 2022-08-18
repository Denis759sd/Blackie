const TelegramBot = require('node-telegram-bot-api')
const token = '2140175033:AAGdbLkzJAlK2jBcebK4TixZ73oKnfuMAHE'
const bot = new TelegramBot(token, {polling: true})
const express = require('express')
const { downloadFile } = require('./downloadFile') 
const { getScreenshot } = require('./get-scrinshot') 

const axios = require('axios')
const fs = require('fs')
const jsdom = require('jsdom')
const { title } = require('process')
const { brotliCompress } = require('zlib')
const { JSDOM } = jsdom

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

let cars = []

let filters = {
    page: 1,
    minYear: '',
    maxYear: ''
}

app.get('/', (req, res) => {
    //bot.sendMessage(req.body.id, req.body.text)

    if (`${req.body.text}` + /\/d/ === 'page') {
        console.log('__________lox__________');
    }

    res.json({status: `${req.body.text} ${/(\d{0,5})/}`})
})

const paginator = (chatId) => {
    axios.get(`https://cars.av.by/filter?brands[0][brand]=6&year[min]=${filters.minYear}&year[max]=${filters.maxYear}&page=${filters.page}`).then(response => {
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

            let carPhoto = items[i].getElementsByClassName('listing-item__wrap')[0]
                .getElementsByClassName('listing-item__photo')[0].getElementsByTagName('img')[0].getAttribute('data-src')

            const path = downloadFile(carPhoto, (carPhoto.replace(/\//g,'')))

            cars.push({
                title: carTitle,
                price: carPrice,
                photo: path
            })
        }
        return cars
    }).then(result => {
        let index = 0
        const sendResult = () => setInterval(() => {
            for (let i = index; i < result.length; i++) {
                const message = `${result[i]['title'].toString()} \nЦена: ${result[i]['price'].toString()}$`
                
                result[i]['photo'].then(fileName => {
                    bot.sendPhoto(chatId, `${__dirname}/${fileName}`, {caption: message})
                    return
                })
                index++
                return
            }
            clearInterval(sendResult)
        }, 30000)

        if (index < result.length) {
            sendResult()
        }
    })
    
}

bot.onText(/\/echo/, (msg, match) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, msg.text)
})

bot.onText(/\/parse/, (msg, match) => {
    const chatId = msg.chat.id

    paginator(chatId)
})

bot.onText(/\/filters/, (msg, match) => {
    const chatId = msg.chat.id
    let message = msg.text.trim().replace('/filters', '').split(' ')

    if (msg.text.replace('/filters', '') === '') {
        bot.sendMessage(chatId, `Filters - page: ${filters.page} | minYear: ${filters.minYear} | maxYear: ${filters.maxYear}`)
        return
    }

    bot.sendMessage(chatId, `Filters - page: ${filters.page} | minYear: ${filters.minYear} | maxYear: ${filters.maxYear}`)
})

bot.onText(/\/page (\d+)/, (msg, match) => {
    console.log(msg);

    const text = msg.text.replace('/page ', '');
    filters.page = Number(text)
})

bot.onText(/\/minYear (\d+)/, (msg, match) => {
    console.log(msg);

    const text = msg.text.replace('/minYear ', '');
    filters.minYear = Number(text)
})

bot.onText(/\/maxYear (\d+)/, (msg, match) => {
    console.log(msg);

    const text = msg.text.replace('/maxYear ', '');
    filters.maxYear = Number(text)
})

bot.onText(/\logs/, (msg, match) => {
    const chatId = msg.chat.id
    if(msg.from.username === 'oll_ti_mist') {
        getScreenshot()
        bot.sendPhoto(chatId, __dirname + '/screenshots/shot.jpg')
        bot.sendDocument(chatId, 'messages.txt')
    }
})

bot.on('message', (msg) => {
    const date = new Date()
    const chatId = msg.chat.id

    let time = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` 

    fs.appendFileSync('messages.txt', `${chatId} | ${msg.text} - ${msg.from.username} - ${time}\n` , () => {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    })


    if (msg.text === '15.10.2021') {
        const message = 'Я люблю тебя очень сильно малышка, \n все будет хорошо, я рядом❤❤❤\n'

        bot.sendMessage(chatId, message)
    }
})

app.listen(5000, () => {
    console.log(`Server started on port ${5000}`);
})