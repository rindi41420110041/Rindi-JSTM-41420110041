var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');
const cls_model = require('./sdk/cls_model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1846802217:AAFjAnyjNw4WXxy2KcQco5YY4wRqin2GII4'
const bot = new TelegramBot(token, {polling: true});


// bots
state = 0;
// Main Menu Bot
bot.onText(/\/start/, (msg) => { 
    //console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /predict`
    );
	state = 0;
});

bot.onText(/\/predict/, (msg) => { 
    //console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `masukkan nilai i|v contoh 9|9`
    );   
    state = 1
});

//bot.on('message', (msg) => {
//	if(state == 1){
//		console.log(msg.Text);		
//  	}else {
//        	state = 0 
//        }
//})

bot.on('message', (msg) => {
	if(state == 1){
		//console.log(msg.Text);
		s = msg.text.split("|");
		//i = parseFloat(s[0])
		//r = parseFloat(s[1])
		model.predict(
			[
				parseFloat(s[0]),
				parseFloat(s[1])
			]
		).then((jres1)=>{
			//v = parseFloat(jres1[0])
			//p = parseFloat(jres1[1])
			
			cls_model.classify([parseFloat(s[0]), parseFloat(s[1]), parseFloat(jres1[0]), parseFloat(jres1[1])]).then((jres2)=>{
						
			bot.sendMessage(
				msg.chat.id,
				`nilai v yang diprediksi adalah ${jres1[0]} volt`
			);
			bot.sendMessage(
				msg.chat.id,
				`nilai p yang diprediksi adalah ${jres1[1]} watt`
			);
			//bot.sendMessage(
				//msg.chat.id,
				//`klasifikasi tegangan ${jres2}`
			//);
			state = 0
		})
	})
    }else {	   
        state = 0 
        }
})

// routers
r.get('/prediction/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

r.get('/classify/:i/:r', function(req, res, next){
	model.predict(
		[
			parseFLoat(req.params.i),
			parseFloat(req.params.r)
		]
	).then((jres)=>{
		cls_model.classify(
			[
				parseFloat(req.params.i),
				parseFloat(req.params.r),
				parseFloat(jres[0]),
				parseFloat(jres[1])
			]
		).then((jres_)=>{
			res.json({jres_})
		})
	})
});

module.exports = r;
