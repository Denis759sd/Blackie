const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const { getScreenshot } = require('./utils/get-scrinshot')
const { getRandomInt } = require('./utils/getRandomInt')
const { paginator } = require('./utils/paginator')

const filters = require('./filters.json')
const articles = require('./articles.json')

const fs = require('fs')

const token = '2140175033:AAE7no6-Z0aC_vGUEibabOdWlnzyviBSrI0'
const bot = new TelegramBot(token, {polling: true})

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    bot.sendMessage(req.body.id, req.body.text)

    res.json({status: `${req.body.text}`})
})

setInterval(() => {
    bot.sendMessage(1170973486, articles.title[getRandomInt(0, articles.title.length)])
}, 60 * 1000)

bot.onText(/\/echo/, (msg, match) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, msg.text)
})

bot.onText(/\/parse/, (msg, match) => {
    const chatId = msg.chat.id

    paginator(chatId, bot)
})

bot.onText(/\/filters/, (msg, match) => {
    const chatId = msg.chat.id

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

bot.onText(/\/logs/, (msg, match) => {
    const chatId = msg.chat.id
    if(msg.from.username === 'oll_ti_mist' || msg.from.username === 'agsmrrrrr') {
        setTimeout(() => {
            getScreenshot()
            bot.sendPhoto(chatId, __dirname + '/screenshots/shot.jpg')
            bot.sendDocument(chatId, 'messages.txt')
        }, 10000)
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
        bot.sendMessage(chatId, articles.title[2])
    }
})

app.listen(5000, () => {
    console.log(`Server started on port ${5000}`);
})