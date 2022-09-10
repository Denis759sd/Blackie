const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const { getRandomInt } = require('./utils/getRandomInt')
const { startParse, stopParse } = require('./utils/paginator')

const filters = require('./filters.json')
const articles = require('./articles.json')

const fs = require('fs')

const token = '2140175033:AAG5EPz7Z2TfYxeBiDan_YjITgNTumMPuPg'
const bot = new TelegramBot(token, {polling: true})
const agsmrrrrr = 1170973486

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    bot.sendMessage(req.body.id, req.body.text)

    res.json({status: `${req.body.text}`})
})

setInterval(() => {
    let day = new Date()
    let hour = day.getHours()        
    let minutes = day.getMinutes()
    let seconds = day.getSeconds()

    let messgage = 'Спасибо тебе за все ты навсегда в моем сердечке, я никогда тебя не забуду, спасибо что всегда была рядом и всегда помогала мне, к сожалению у нас ничего не получилось(, я верил что все получится, я безумно благодарен тебе за все, пожалуйста одевайся тепло и заботься о себе, ты самая лучшая и самая красивая, не пей много кофе и энергетиков, ты большая умничка, я буду всегда верить в тебя, будь счастлитва, я люблю тебя моя пингвиниха, прощай.'

    for (let i = 0; i < 23; i++) {
        if (hour === i && minutes === 0 && seconds === 0){
            bot.sendMessage(agsmrrrrr, articles.title[getRandomInt(0, articles.title.length - 1)])
            // bot.sendMessage(agsmrrrrr, messgage)
            console.log(`send to agsmrrrrr`, `${hour}h-${minutes}m-${seconds}s`);
        }
    }
    
}, 1000)

bot.onText(/\/echo/, (msg, match) => {
    const chatId = msg.chat.id

    bot.sendMessage(chatId, msg.text)
})

bot.onText(/\/parse/, (msg, match) => {
    const chatId = msg.chat.id

    startParse(chatId, bot)
    bot.sendMessage(chatId, 'Machine parsing start!')
})

bot.onText(/\/stop/, (msg, match) => {
    const chatId = msg.chat.id

    stopParse()
    bot.sendMessage(chatId, 'Machine parsing stopped!')
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
        bot.sendMessage(chatId, articles.title[2])
        bot.sendPhoto(chatId, )
    }

	console.log(msg.text)
})