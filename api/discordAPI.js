const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const Discord = require('discord.js');

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://discordbotsnation.glitch.me/api/discord/callback');


router.get('/login', (req, res) => {
  console.log("[COOKIES] " + JSON.stringify(req.cookies));
  console.log(req)
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
            return res.redirect(`/newbot/?code=${json.access_token}`);
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
  

router.get('/callback', (req, res) => {
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
      res.redirect(`/newbot/?code=${json.access_token}`);
    });
  });
});

router.get('/user', (req, res) => {
  if (!req.query.code) return res.send('no');
  const code = req.query.code;
  fetch(`https://discordapp.com/api/users/@me`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.query.code}`,
      },
    }).then(response => {
    response.json().then(json => {
      res.send(json);
    });
  });
  console.log(req.query);
});


let client = new Discord.Client();

client.on('ready', () => {
  console.log('API instance live');
});

client.login(process.env.TOKENE);

router.get('/avatar/:id', (req, res) => {
  client.fetchUser(req.params.id).then(user=>{
      if(user){
    res.redirect(user.displayAvatarURL);
  }else{
    res.redirect('https://cdn.browshot.com/static/images/not-found.png');
  }
  }).catch(e=>{
    res.redirect('https://cdn.browshot.com/static/images/not-found.png');
  });
});

router.get('/status/:id', (req, res) => {
  let user = client.users.get(req.params.id);
  if (user) {
    res.send({
      status: user.presence.status
    })
  } else {
    res.send({
      status: null
    })
  }
});

router.get('/tag/:id', (req, res) => {
  client.fetchUser(req.params.id).then(user => {
  if(user){
    res.send({tag: user.tag});
  }else{
    res.status(404).send("{\"tag\": \"USER NOT FOUND\"}");
  }
  }).catch(err => {
    res.status(404).send("{\"tag\": \"USER NOT FOUND\"}");
  });
});

module.exports = router;