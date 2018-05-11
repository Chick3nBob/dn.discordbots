const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const Discord = require('discord.js');
const fs = require('fs');
 
const router = express.Router();

let client = new Discord.Client();

client.on('ready', () => {
  console.log('[DBN] Newbot instance live');
});

client.login(process.env.TOKENE);
let bodyParser = require('body-parser');
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
router.post('/', (req, res) => {
  const https = require("https");

const url =
  "https://discordbotsnation.glitch.me/api/discord/user/?code=" + req.body.key;

https.get(url, result => {
  result.setEncoding("utf8");
  let body = "";
  result.on("data", data => {
    body += data;
  });
  result.on("end", () => {
    if(body == 'no') return res.redirect('https://discordbotsnation.glitch.me/api/discord/login');
    body = JSON.parse(body);
    // console.log(body);
    const guild = client.guilds.get('437196655981494282');
    if(!client.guilds.get('437196655981494282').members.get(body.id)) return res.send('[DISCORD BOTS NATION] Error:To submit a bot, you should join and stay in the <a href="https://discord.gg/epDfHPU">DISCORD BOTS NATION server</a> ');
    
      client.fetchUser(req.body.boatID).then(bot => {
    if(!bot.bot) return res.send('[DISCORD BOTS NATION] Error:Please submit a bot account and not a user account.');
    
    if(client.guilds.get('437196655981494282').members.get(req.body.boatID)) return res.send('[DISCORD BOTS NATION] Error:This bot is already in our database!');
    
    if(!req.body.prefix) return res.send('[DISCORD BOTS NATION] Error:Please include your bot prefix.');
    
    if(!req.body.helpCommand) return res.send('[DISCORD BOTS NATION] Error:Please include the help command');
    
        if(process.DB.get('queue').find({id: req.body.boatID + ''}).value()) return res.send('[DISCORD BOTS NATION] Error:This bot is already in our database and is waiting for approval');
        if(process.DB.get('queue').find({id: req.body.boatID + ''}).value()) return res.send('[DISCORD BOTS NATION] Error:This bot is already in our database and has been already accepted');
    try{
      process.DB.get('queue').push({
        id: req.body.boatID,
        name: bot.tag,
        prefix: req.body.prefix,
        hc: req.body.helpCommand,
        owner: [body.id],
        desc: req.body.description,
        git: req.body.git,
        website: req.body.website,
        support: req.body.support
      }).write()
    } catch(e) {console.log(e);}
                client.channels.get("437198372684693518").send("**[DISCORD BOT NATION (DBN)] - SUBMIT**\n__BOT:__ " + `${bot.tag}` + " (`" + `${bot.id}` + "`)" + `\n__OWNER:__ <@${body.id}>` + " (`" + `${body.id}` + "`)"); // c'mon why the ping
        res.redirect("/queued");
  }).catch(err => {
    console.error(err);
    return res.send('[DISCORD BOTS NATION] DBN hasn\'t found this user..');
  });
  });
});
});

module.exports = router;
