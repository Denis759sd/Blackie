const TelegramBot = require('node-telegram-bot-api')
const { getRandomInt } = require('./utils/getRandomInt')
const { pushToJson } = require('./utils/addToJsonFile')

const { Stickers } = require('./enums/stickers')

const articles = require('./articles.json')
const stickers = require('./stickers.json')

const fs = require('fs')

const token = "2140175033:AAHpw5NQOrV5-mOgDCw8FGlOdUcIAKZZYoI"
const bot = new TelegramBot(token, {polling: true})
const agsmrrrrr = 1170973486
const olltimist = 421215629

setInterval(() => {
    let day = new Date()
    let hour = day.getHours()        
    let minutes = day.getMinutes()
    let seconds = day.getSeconds()

    for (let i = 0; i < 23; i++) {
        if (hour === i && minutes === 0 && seconds === 0){
            let randomArticleNum = getRandomInt(0, articles.title.length)
            let message = `Самой красивой девочке на свете отправленно сообщение, \nпод индексом ${randomArticleNum} \n${hour}:${minutes}:${seconds}`

            bot.sendMessage(agsmrrrrr, articles.title[randomArticleNum]).then( () => {
                bot.sendSticker(agsmrrrrr, stickers.name[Stickers.LOVE]).then(() => {
                    bot.sendMessage(olltimist, message)
                })
            })
            
            console.log(`send to agsmrrrrr`, `${hour}h-${minutes}m-${seconds}`);
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

bot.onText(/\/love(.+)?/, (msg, match) => {
    const chatId = msg.chat.id

    if(msg.text.replace('/love', '').trim() !== '') {
        bot.sendMessage(olltimist, msg.text.replace('/love', ''))
        return
    }

    bot.sendMessage(agsmrrrrr, articles.title[randomArticleNum]).then( () => {
        bot.sendSticker(agsmrrrrr, stickers.name[Stickers.LOVE]).then(() => {
            bot.sendMessage(olltimist, 'Message send success!');
        }).catch( (err) => {
            bot.sendMessage(olltimist, 'Message send failure!');
            console.log(`Error: ${err}`);
        })
    })
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