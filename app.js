const TelegramBot = require('node-telegram-bot-api')
const { getRandomInt } = require('./utils/getRandomInt')
const { startParse, stopParse } = require('./utils/paginator')

const filters = require('./filters.json')
const articles = require('./articles.json')

const fs = require('fs')

const token = "2140175033:AAHpw5NQOrV5-mOgDCw8FGlOdUcIAKZZYoI"
const bot = new TelegramBot(token, {polling: true})
const agsmrrrrr = 1170973486
const olltimist = 421215629

var port = process.env.PORT || 8000;

setInterval(() => {
    let day = new Date()
    let hour = day.getHours()        
    let minutes = day.getMinutes()
    let seconds = day.getSeconds()

    for (let i = 0; i < 23; i++) {
        if (hour === i && minutes === 0 && seconds === 0){
            let message = `Самой красивой девочке на свете отправленно сообщение в: ${hour}h-${minutes}m-${seconds}s`

            bot.sendMessage(agsmrrrrr, articles.title[getRandomInt(0, articles.title.length - 1)])
            bot.sendMessage(olltimist, message)
            
            console.log(`send to agsmrrrrr`, `${hour}h-${minutes}m-${seconds}s`);
        }
    }
}, 1000)

bot.onText(/\/echo(.+)?/, (msg, match) => {
    const chatId = msg.chat.id

    if(msg.text.replace('/echo', '').trim() !== '') {
        bot.sendMessage(chatId, msg.text.replace('/echo', ''))
        return
    }

    bot.sendMessage(chatId, msg.text)
})

// Parser
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

// Filters
bot.onText(/\/filters/, (msg, match) => {
    const chatId = msg.chat.id

    if (msg.text.replace('/filters', '') === '') {
        bot.sendMessage(chatId, `Filters \n| brand:${filters.brand} |\n| page: ${filters.page} |\n| minYear: ${filters.minYear} |\n| maxYear: ${filters.maxYear} |`)
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

bot.onText(/\/brand (.+)/, (msg, match) => {
    console.log(msg)

    const text = msg.text.replace('/brand', '')
    filters.brand = text
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

    if (process.env.PROJECT_STATUS === "dev") {
        fs.appendFileSync('messages.txt', `${chatId} | ${msg.text} - ${msg.from.username} - ${time}\n` , () => {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        })
    }

    if (msg.text === '15.10.2021') {
        bot.sendMessage(chatId, articles.title[2])
    }

	console.log(msg.text)
})