const TelegramBot = require('node-telegram-bot-api')
const token = '2140175033:AAEr8kkXBboJ_yGnZX2RWpMkkPSQzqVoXDA'
const bot = new TelegramBot(token, {polling: true})

const axios = require('axios')
const fs = require('fs')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const paginator = () => {
    let article

    axios.get('https://cars.av.by/filter?brands[0][brand]=6&year[min]=1998&year[max]=2001').then(response => {
        let currentPage = response.data
        const dom = new JSDOM(currentPage)

        let link = dom.window.document.getElementsByClassName('listing__items')[0]
            .getElementsByClassName('listing-item')[0].getElementsByClassName('listing-item__wrap')[0]
            .getElementsByClassName('listing-item__about')[0].getElementsByClassName('listing-item__title')[0]
            .getElementsByTagName('a')[0].getElementsByTagName('span')[0].outerHTML

        article = link.toString().replace('<', '').replace('>', '').replace(/"/, "-")

        console.log(article)
    })

    return 'fdfsd' + article
}

bot.onText(/\/echo/, (msg, match) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, msg.text)
})

bot.onText(/\/parse/, (msg, match) => {
    const chatId = msg.chat.id

    const page = paginator()

    bot.sendMessage(chatId, page)
})

bot.on('message', (msg) => {
    const chatId = msg.chat.id

    if (msg.text === '15.07.2021') {
        const message = 'Я люблю тебя очень сильно малышка, \n все будет хорошо, я рядом❤❤❤\n'
        bot.sendMessage(chatId, message)
    }
})
