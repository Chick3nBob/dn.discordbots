const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const Discord = require('discord.js');
const fs = require('fs');
const snek = require('snekfetch');

const router = express.Router();
var queue = require("../data/queue.json");
var bots = require("../data/bots.json");

let bot;
router.get('/april', (req, res) => {
  res.sendFile('/app/css/april.css');
});



router.get('/credits', (req, res) => {
  let members = bot.guilds.get('437196655981494282').members;
  let owners = [];
  let bdevelopers = [];
  let developers = [];
  let hdevelopers = [];
  let mods = [];
  let cool_people = [];
  members.forEach(member => {
    if(member.roles.find('name', 'CEO / FOUNDER')){
      owners[owners.length] = member;
    }
  });
  members.forEach(member => {
    if(member.roles.find('name', 'Developer')){
      developers[developers.length] = member;
    }
  });
    members.forEach(member => {
    if(member.roles.find('name', 'Bot Developers')){
      bdevelopers[bdevelopers.length] = member;
    }
  });
    members.forEach(member => {
    if(member.roles.find('name', 'Head Dev')){
      hdevelopers[hdevelopers.length] = member;
    }
  });
  members.forEach(member => {
    if(member.username == "Jupiter" && member.discriminator == "2991") {
      cool_people[cool_people.length] = member; 
    }
  });
  res.render('/app/views/credits.ejs', {bosses: cool_people, members: members, owners: owners, developers: developers, hdevelopers: hdevelopers});
});


router.get("/login", (req, res) => {
  res.redirect('/login/login')
  //res.render('login.ejs', {req:req})
});

router.get("/queue", (req, res) => {
  fetch('https://discordbots.glitch.me/api/discord/user/?code=' + req.query.code).then(response => {
        response.json().then(body => {
      if(body.id && bot.users.get(body.id)){
        
        if(bot.guilds.get('437196655981494282').members.get(body.id) && bot.guilds.get('437196655981494282').members.get(body.id).roles.find('name', 'Moderators')){
               res.render('queue.ejs', {bots: process.DB.get('queue').value(), bot: bots, req: req}); 
      }
      }});
  });
  //res.redirect("/queue/login");
});
router.get("/certify/:id", (req,res) => {
  
  var bots = process.DB.get('bots').value().filter(v=>v.owner.includes(req.params.id));
  
  res.render('certify.ejs', {
    bots: bots
  });
});

router.get("/docs/certify", (req, res) => {
  res.render("app/views/docs/certify.ejs");
});

router.get('/queue/login', (req, res) => {
  console.log("[COOKIES] " + JSON.stringify(req.cookies));
  if (req.cookies.DISCORD_SECURITY != undefined && req.cookies.DISCORD_SECURITY != 'undefined') {
    try {
     //gotta refresh the token
      var token = req.cookies.DISCORD_SECURITY;
      fetch(`https://discordapp.com/api/oauth2/token?client_id=${CLIENT_ID}&grant_type=refresh_token&refresh_token=${token}&client_secret=${CLIENT_SECRET}&redirect_uri=${redirect}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        }).then(response => {
          response.json().then( json => {
          // console.log("[SESSION REFRESHED] " + JSON.stringify(json));
          // TODO: Add Cookie-Law warning at the home page
          // res.header('Set-Cookie', `BOAT_SECURITY=${json.access_token}`);
          if (json.access_token) {
            return res.redirect(`/queue/?code=${json.access_token}`);
          } else {
            return; 
          }
        });
      });
    } catch(e) {
      console.log("[ERROR ON LOGIN] "  + String(e))
      return res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=identify`);
    }
  } else {
    return res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=identify`);
  }
 /* FUNCTION OF THIS IS TO LIMIT THE USERS ON THE QUEUE PAGE TO ONLY MODS AND ADMINS
 
 const members = bot.guilds.get(' 437196655981594282').members;
    members.forEach(member => {
  if (!member.roles.find("name", "Website Administrator")) {
    res.redirect("/queue/login")
  }
  if (!member.roles.find("name", "Website Moderators")) {
    res.redirect("/queue/login")
  }
  if (!member.roles.find("name", "Moderators")) {
    res.redirect("/queue/login")
  }
  if (!member.roles.find("name", "Website Developers")) {
    res.redirect("/queue/login")
  } 
}) */
  
});

router.get("/panel/:pass", (req, res) => {
  
  var pass = req.params.pass;
  
  var passs = [
    '123'
  ]
  
  if (passs.includes(pass)) {
    res.render('panel.ejs', {req: req});
  } else {
    res.send('<a href="/login">Please Login again</a>')
  }
});


const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://discordbots.glitch.me/login/callback');


router.get('/panel', (req, res) => {
  const url = "https://discordbots.glitch.me/api/discord/user/?code=" + req.query.code;


router.get(url, result => {
  result.setEncoding("utf8");
  let body = "";
  result.on("data", data => {
    body += data;
  });
  result.on("end", () => {
    if(body == 'no') return res.redirect('https://discordbots.glitch.me/api/discord/login');
    body = JSON.parse(body);
    // console.log(body);
    const members = bot.guilds.get('437196655981594282').members;
    members.get(body.id)
    members.forEach(member => {
      if (member.roles.find("name", "CEO / FOUNDER")) {
        res.send('<a href ="/panel/123"> Go to the panel.</a>');
      }
      if (member.roles.find("name","Developer")) {
        res.send('<a href ="/panel/123"> Go to the panel.</a>');
  };
    });
});
});
});

router.get('/login/login', (req, res) => {
  console.log("[COOKIES] " + JSON.stringify(req.cookies));
  if (req.cookies.DISCORD_SECURITY != undefined && req.cookies.DISCORD_SECURITY != 'undefined') {
    try {
     //gotta refresh the token
      var token = req.cookies.DISCORD_SECURITY;
      fetch(`https://discordapp.com/api/oauth2/token?client_id=${CLIENT_ID}&grant_type=refresh_token&refresh_token=${token}&client_secret=${CLIENT_SECRET}&redirect_uri=${redirect}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        }).then(response => {
          response.json().then( json => {
          console.log("[SESSION REFRESHED] " + JSON.stringify(json));
          // TODO: Add Cookie-Law warning at the home page
          // res.header('Set-Cookie', `BOAT_SECURITY=${json.access_token}`);
          if (json.access_token) {
            return res.redirect(`/panel/123/?code=${json.access_token}`);
          } else {
            return; 
          }
        });
      });
    } catch(e) {
      console.log("[ERROR ON LOGIN] "  + String(e))
      return res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=identify`);
    }
  } else {
    return res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=identify`);
  }
});
  

router.get('/login/callback', (req, res) => {
  if (!req.query.code) {
    res.redirect("/403");
  }
  const code = req.query.code;
  console.log("[ACCESS KEY] " + code);
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
      },
    }).then(response => {
      response.json().then( json => {
      console.log("[NEW SESSION] " + JSON.stringify(json));
      // TODO: Add Cookie-Law warning at the home page
      // res.header('Set-Cookie', `BOAT_SECURITY=${json.access_token}`);
      console.dir(String(json.refresh_token))
      res.cookie("DISCORD_SECURITY", String(json.refresh_token));
      res.cookie("test_cookie", "sorry");
      res.redirect(`/panel/?code=${json.access_token}`);
    });
  });
});

router.get("/edit", (req, res) => {
  res.render('edit.ejs');
}); 

router.get('/stats', (req, res) => {
  res.render('stats.ejs');
});

router.get("/approved", (req, res) => {
  res.render('approved.ejs');
});

router.get("/declined", (req, res) => {
  res.render('declined.ejs');
});

router.get("/certify", (req, res) => {
  res.render('certify.ejs');
});


router.get("/", (request, res) => {
  res.render('index.ejs');
});

router.get("/agree", (req, res) => {
  res.render('to-agree.ejs');
});

router.get("/newbot", (request, res) => {
  res.render('newbot.ejs');
});

router.get("/users", (req, res)  => {
  let members = bot.guilds.get('437196655981494282').members;
  let users = [];
  members.forEach(member => {
    if(member.roles.find('name', '@everyone') && member.user){
      users[users.length] = member;
    }
  });
  res.render('/app/views/users.ejs', {users: users});// or '/app/views/users.ejs'
});

router.get("/cookies", (request, res) => {
  res.render('cookies.ejs');
});

router.get("/botdevs", (req, res)  => {
  let members = bot.guilds.get('437196655981494282').members;
  let bdevelopers = [];
  members.forEach(member => {
    if(member.roles.find('name', 'Bot Developers')){
      bdevelopers[bdevelopers.length] = member;
    }
  });
  res.render('/app/views/botdevs.ejs', {developers: bdevelopers});// or '/app/views/users.ejs'
});

router.get('/bots/:id', (req, res) => { // Just watch and learn kiddos.
  if (req.params.id != null){
      let botInfo = process.DB.get('bots').find({id:req.params.id});
      if(!botInfo.value()) return res.status(404).render('error.ejs')
      let botInfoValue = botInfo.value();
            let owners = [];
        botInfoValue.owner.forEach(owner => {
          if(bot.users.get(owner)){
            owners[owners.length] = bot.users.get(owner).tag;
          }
        });
    res.render('bot.ejs', {botInfo: botInfoValue, ownerInfo: owners.join(', '), bot: bot})
    
  } else {
  res.status(404).render('error.ejs');
  }
});

router.get("/403", (req, res) => {
    res.render('403.ejs');
});

router.get("/404", (req, res)  => {
    res.render('404.ejs');
});

router.get("/503", (req, res) => {
    res.render('503.ejs');
});

router.get("/queued", (req, res) => {
    res.render('queued.ejs');
});

router.get('/bots', (req, res) => {
  res.render('bots.ejs', {bots: process.DB.get('bots').value(), bot: bot});
});

router.get('/search', (req, res) => {
  res.render('search.ejs');
});

router.get("/decline/:id", (req, res) => {
  fetch('https://discordbots.glitch.me/api/discord/user/?code=' + req.query.code).then(response => {
        response.json().then(body => {
      if(body.id && bot.users.get(body.id)){
        
        if(bot.guilds.get('437196655981594282').members.get(body.id)&&bot.guilds.get('437196655981594282').members.get(body.id).roles.find('name', 'Moderator')){
               res.render('decline.ejs', {DB: process.DB, bot: bot, req: req}); 
        }else{
          res.send('404 not found');
        }  
      } else {
        res.send('I believe there is an error with permissions');
      }
    });
  });
  //res.redirect("/queue/login");
});

router.get("/decline/:id/do", (req, res) => {
  let reason;
  
  if(req.query.reason=='Other?'){
    reason = req.query['other-reason']
  }else{
    reason = req.query.reason;
  }
  
  res.redirect(`https://discordbots.glitch.me/api/decline/${req.params.id}/?code=${req.query.code}&reason=${reason}`);
});

router.get('/users/:id', (req, res) => {
  
  var usr = bot.users.get(req.params.id)
  if (!usr) { 
    res.send('No User Found!');
  }
  if (usr.bot) {
    res.redirect('/bots/' + usr.id);
  }
  var bots = process.DB.get('bots').value().filter(v=>v.owner.includes(req.params.id));
  
  if (!bots) {
    res.send('User isn\'t registered!')
  }  
  
  var profile = process.DB.get('users').find({id: req.params.id}).value()//)
  res.render('user.ejs', {
    user: usr,
    bots: bots, 
    profile: profile,
    bot: bot
  })
})


module.exports.router = router;
  
module.exports.setBot = (botUser) => {
  bot = botUser;
  process.bot = botUser;
}