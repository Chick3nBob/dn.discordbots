setInterval(function () { console.log('Restarting Server!'); process.exit(0) }, 240000)


const express = require('express')
const app = express()
const fs = require('fs');
var path = require('path');

let consoled = require('consoled');
consoled = new consoled.Console();

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./db.json')
process.DB = low(adapter);
process.DB.defaults({queue: [], bots: [], users: [], certifyQueue: []}).write();

var loggic = require('loggic');

consoled.log('Queue size: ' + process.DB.get('queue').value().length)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let token = process.env.TOKENE;
[1,2,3].forEach(nothin => {
  token = Buffer.from(token, 'base64').toString('ascii');
});
process.env.TOKEN = token;


const requests = require('./routes/app.js'); // When requiring files like these, they dont need .js // ah no?

const api = require('./routes/api');
const bot = require('./bot/index.js'); // The bot itself.

requests.setBot(bot)



var cookies = require("cookie-parser"); // Cookies :3

app.use(cookies()); // Cookies 2.0 :3

app.use('/', express.static(path.join(__dirname, 'public'))); // Hosts files in the folder 'public' under /public/*

app.use('/', requests.router); // Forwards requests to the request file

//app.use('/api');
app.use('/api', api);

// at me don't work ;-; // See discord//
// app.use(function(req, res, next) { //404 Error Handler
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// app.use(function(err, req, res, next) { // Error Handler
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(process.env.PORT, () => {
  loggic.log({
    text: 'Website is running on port: ' + process.env.PORT,
    color: 'green'
  }, 'server.js')
})
//});