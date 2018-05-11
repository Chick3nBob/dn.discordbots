setInterval(function () { console.log('Restarting [DBN] Bot'); process.exit(0) }, 240000)

const Discord = require('discord.js');
const fs = require('fs')
const queue = require('../db.json').queue
const bots = require('../db.json').bots
const responses = require('./responses.json')
const commands = require('./commands.json')
const prefix = 'db,'
const cqueue = require('../db.json').certifyQueue

let bot = new Discord.Client();

bot.on('ready', () => {
  console.log('Bot up and running!');
  bot.user.setActivity('discordbotsnation.glitch.me | db,help', {type: 'watching'});
}); 
 
function updateJSON(data){
  fs.writeFile('../data/queue.json', JSON.stringify(data, null, 2), function (err) {
    if (err) return console.log(err);
    require('child_process').exec('refresh', (err, out) => {});
  });
}

function clean(text) { // For the eval command
  if (typeof(text) === "string") // this place is for the auto restart.. look down
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
};


bot.on('guildMemberAdd', (member) => {
  if(process.DB.get('bots').find({id: member.user.id})){
    let joinedBot = process.DB.get('bots').find({id: member.user.id}).value()
    if(joinedBot){
      member.addRole('437214149450399745');
      member.guild.members.get(joinedBot.owner[0]).addRole('437214476907970571');
    }
  }
});

bot.on('message', message => {
  
  if(message.guild.id != '437196655981494282') return;
  if(message.content.substr(0, prefix.length) != prefix) return;
  let args = message.content.split(" ");
  const evalargs = message.content.split(" ").slice(1);
  let command = args[0];
  command = command.slice(prefix.length).toLowerCase();
  args = args.slice(1);
  
  if (command == 'queue'){
    let queueLen = process.DB.get('queue').size().value()
    if(message.channel.id != '437214767850061824') return message.channel.send({embed: new Discord.RichEmbed()
                                                                              .setTitle(responses.noperms.title)
                                                                              .setColor(responses.noperms.color)
                                                                             })
    if(queueLen<=0) return message.channel.send({embed: new Discord.RichEmbed()
                                                 .setTitle(commands.queue.errors.empty)
                                                 .setColor(commands.queue.errors.color)
                                                })
    let limit = 10;
    let index = 0;
    
    let out = '```diff\n'; // I am fixing that it shows the owners
    let embed = new Discord.RichEmbed()
    .setTitle('Queued Bot(s)')
    .setColor(commands.stand)
    process.DB.get('queue').value().forEach(queuedBot => { 
      let git;
      if (queuedBot.git.startsWith('http')) {
        git = `[Click!](${queuedBot.git})`
      } else { git = 'Not a valid link'}

      if(index < limit){
         embed.addField(`${queuedBot.name} (${queuedBot.id})`, `
Owners: ${queuedBot.owner.join(', ')}
Prefix: **${queuedBot.prefix}** 
Help command: **${queuedBot.hc}**
Invite: [Click!](${`https://discordapp.com/oauth2/authorize/?permissions=0&scope=bot&client_id=${queuedBot.id}`})
GitHub Repo: ${queuedBot.git}
Website: ${queuedBot.website}
`)
        embed.addBlankField(false);
        // out += '+ Bot name: ' + queuedBot.name + " (" + queuedBot.prefix + " | " + queuedBot.hc + ") – Owner: " + queuedBot.owner.join(", ") + `\n- Invite https://discordapp.com/oauth2/authorize?client_id=${queuedBot.id}&scope=bot&permissions=0\n`;
        index++;
      }
    });
    
    message.channel.send({embed})
  }

  if (command == 'approve') {
    
    if (!args[1] || isNaN(parseInt(args[1]))) {
    if(message.member.roles.find('name', 'Moderators')){
    if(!process.DB.get('queue').value()[0]){
        return message.channel.send({embed: new Discord.RichEmbed()
                                     .setTitle(commands.queue.errors.empty)
                                     .setColor(commands.queue.errors.color)
                                    });
      }
      
    bot.channels.get("437198372684693518").send(`**[DISCORD BOTS NATION (DBN)] -  APPROVED**\n__BOT:__ ${process.DB.get('queue').value()[0].name} (\`${process.DB.get('queue').value()[0].id}\`)\n__OWNER(S):__ <@${process.DB.get('queue').value()[0].owner[0]}> (\`${process.DB.get('queue').value()[0].owner[0]}\`)\n\n__MODERATOR:__ <@${message.author.id}> (\`${message.author.id}\`)`);
    message.author.send({embed: new Discord.RichEmbed()
                          .setTitle('Bot ' + process.DB.get('queue').value()[0].name + ' was accepted.') 
                          .setDescription('Use [this](https://discordapp.com/api/oauth2/authorize?client_id=' + process.DB.get('queue').value()[0].id + '&scope=bot&permissions=0) to invite the bot to the Discord Bots Nation Server.')
                          .setColor(commands.stand)}) 
      
      bot.users.get(process.DB.get('queue').value()[0].owner[0]).send({embed: new Discord.RichEmbed()
                                                                       .setTitle('Bot accepted')
                                                                       .setDescription(':tada: your bot **' + process.DB.get('queue').value()[0].name + '** was accepted :tada: !')
                                                                       .setColor(commands.stand)
                                                                      // yo make the desc for the accepted one so mods know what to use to invite the bot
                                                                       //sure! thx <3 ;3 
                                                                      })
      process.DB.get('bots').push(process.DB.get('queue').value()[0]).write();
      
      process.DB.set('queue', process.DB.get('queue').value().slice(1)).write();      
    }else{
      return message.channel.send({embed: new Discord.RichEmbed()
                                   .setTitle(responses.noperms.title)
                                   .setColor(responses.noperms.color)
                                  })
    }
    } else {
      if (message.member.roles.find('name', 'Moderators')) {
      if(!process.DB.get('queue').value()[0]){
        return message.channel.send({embed: new Discord.RichEmbeds().setTitle(responses.nolist.title).setColor(responses.nolist.title)});
      }
        var ind = parseInt(args[1]);
      
        // this needs embed
        
      bot.channels.get("437198372684693518").send({embed: new Discord.RichEmbed()
                                                   .setTitle('Bot Approved')
                                                   .setDescription(`Bot <@${process.DB.get('queue').value()[ind-1].id}> by <@${process.DB.get('queue').value()[ind-1].owner[0]}> was approved by <@${message.author.id}>`)
                                                   .setColor(commands.stand)
                                                  })
      message.author.send({embed: new Discord.RichEmbed()
                           .setTitle('Approved')
                           .setDescription(`Click (here)[https://discordapp.com/oauth2/authorize?client_id=${process.DB.get('queue').value()[0].id}&scope=bot&permissions=0] to invite bot to server!`)
                           .setColor(commands.stand)
                          })
      bot.users.get(process.DB.get('queue').value()[ind-1].owner[0]).send({embed: new Discord.RichEmbed()
                                                   .setTitle('Bot Approved')
                                                   .setDescription(`Bot <@${process.DB.get('queue').value()[ind-1].id}> by <@${process.DB.get('queue').value()[ind-1].owner[0]}> was approved by <@${message.author.id}>`)
                                                   .setColor(commands.stand)
                                                  })
      
      process.DB.get('bots').push(process.DB.get('queue').value()[ind-1]).write();
      
      process.DB.set('queue', process.DB.get('queue').value().splice(ind-1, 1)).write();      
    }else{
      return message.channel.send({embed: new Discord.RichEmbed()
                                   .setTitle(responses.noperms.title)
                                   .setColor(responses.noperms.color)
                                  })
    }
    }
  }
  
  if (command == 'decline') {
    if(message.member.roles.find('name', 'Moderators')){
      if(!process.DB.get('queue').value()[0]){
        return message.channel.send({embed: new Discord.RichEmbed()
                                     .setTitle("The queue is empty")
                                     .setColor("RED")
                                    })
      }   
      bot.channels.get("437198372684693518").send({embed: new Discord.RichEmbed()
                                                   .setTitle('Bot Declined')
                                                   .setDescription(`__Bot:__ ${process.DB.get('queue').value()[0].name} (\`${process.DB.get('queue').value()[0].id}\`)\n__OWNER:__ <@${process.DB.get('queue').value()[0].owner}>\n\n__MODERATOR:__ <@${message.author.id}> \n__REASON:__ ${args.join(' ')}`)
                                                   .setColor(commands.stand)}) // stop for a sec plz fix errors so i can test
      process.DB.get('queue').value()[0].owner.forEach(botOwner => {
      bot.users.get(botOwner).send({embed: new Discord.RichEmbed()
                                      .setTitle('Bot DECLINED)')
                                      .setDescription(`Your bot, ${process.DB.get('queue').value()[0].name}, was declined by <@${message.author.id}> for ${args.join(' ')}`)
                                      .setColor(commands.stand)
                                     })
      });
      process.DB.set('queue', process.DB.get('queue').value().slice(1)).write();
    }else{
      return message.channel.send({embed: new Discord.RichEmbed()
                                   .setTitle(responses.noperms.title)
                                   .setColor(responses.noperms.color)
                                  })
    }
    }
  
  if (command == 'eval'){
    if(message.author.id !== "213928278497558528") return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
      if (evaled.length > 1999) {message.channel.send({embed: new Discord.RichEmbed().setTitle('Eval').setDescription('Response too long').setColor('RED')})}
      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      var errmsg = "```xl\n" + clean(err) + "\n```"
      message.channel.send({embed: new Discord.RichEmbed().setTitle('Error').setDescription(errmsg).setColor('RED')})
    }
  }
  
  if (command == 'bots') {
    if(message.member.roles.find('name', 'Moderators')) {
    var myBots = '';
    var n = 0
    var user = message.mentions.users.first() || bot.users.get(args[0]) || message.author; // LOL;
      
      if (user.bot) {
        let embed = new Discord.RichEmbed()
        .setTitle('This user is a bot.')
        .setColor('RED');
        return message.channel.send({embed})
      }
      process.DB.get('bots').value().forEach(b => {
      b.owner.forEach(o => {
        if (o === user.id) {
          n++
          myBots = myBots + '\n' + n + '. '  + b.name
        }
      })
    })
      var b 
      if (n === 1) b = 'bot'
      if (n !== 1) b = 'bots'
      message.channel.send({embed: new Discord.RichEmbed() 
                            .setDescription(myBots)
                            .setAuthor(`${user.tag}'s ${b}`, user.displayAvatarURL)
                            .setColor('RANDOM') 
                           })
    /*
    let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
        if(!botInfo) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle('The bot is not in the list!')
                                                  .setColor('RED')
                                                 })
        botInfo = botInfo.value();
        let owners = [];
        botInfo.owner.forEach(owner => {
          if(bot.users.get(owner)){
            owners[owners.length] = '<@' + owner + '> (' + bot.users.get(owner).tag + ')'
          }
        });*/
    }
  }
  
  if (command == 'owner') {
      if(message.mentions.members.first()){
      if(message.mentions.members.first().user.bot){
      let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
      if(!botInfo) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
      botInfo = botInfo.value();
      let owners = [];
      botInfo.owner.forEach(owner => {
      if(bot.users.get(owner)){
        owners[owners.length] = '<@' + owner + '> (' + bot.users.get(owner).tag + ')'
      }
      });
        let ownEmbed = new Discord.RichEmbed()
        .setColor(commands.stand)
        .setTitle('Owner(s) | ' + message.mentions.members.first().user.tag)
        .addField('Owner(s):', owners.join(', '));
        message.channel.send(ownEmbed);
      } else {
        message.channel.send({embed: new Discord.RichEmbed().setTitle(responses.nobot.title).setColor(responses.nobot.color)})
      }
    } else {
      message.channel.send({embed: new Discord.RichEmbed()
                            .setTitle("Usage")
                            .setDescription(prefix + commands.owner.desc)
                            .setColor(responses.usage.color)
                           })
    }
  }
 
  if (command == 'botinfo') {
    if (message.mentions.members.first()) {
      if (message.mentions.members.first().user.bot) {
        let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
        if(!botInfo) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
        botInfo = botInfo.value();
        
        let owners = [];
        botInfo.owners.forEach(owner => {
          if(bot.users.get(owner)){
            owners[owners.length] = '<@' + owner + '> (' + bot.users.get(owner).tag + ')'
          }
        });
        
        if(botInfo == null) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
        var b = message.mentions.members.first().user
        let embed = new Discord.RichEmbed()
        .setTitle(b.tag)
        .setThumbnail(b.avatarURL)
        .setColor(commands.stand)
        .addField("Prefix", botInfo.prefix)
        .addField("Owners", owners.join(', '))
        .addField("Help command", botInfo.hc)
        .addField("Description", botInfo.desc ? botInfo.desc : "None")
        .addField('Github', botInfo.git ? botInfo.git : 'None')
        .addField('Server count', botInfo.servers ? botInfo.servers  : 'None')
        .addField('Website', botInfo.website ? botInfo.website : 'None')
        .addField('Support Server', botInfo.support ? botInfo.support: 'None');

        message.channel.send({embed})

      }
    }
  }
  
  if(command == 'prefix') {
    
    if(message.mentions.members.first()){
      if(message.mentions.members.first().user.bot){
        let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
        if(!botInfo.value() || (botInfo === undefined)) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
        
        botInfo = botInfo.value();
        
        let preEmbed = new Discord.RichEmbed()
        .setColor(commands.stand)
        .setTitle('Prefix | ' + message.mentions.members.first().user.tag)
        .addField('Prefix:', `${botInfo.prefix}`);
        message.channel.send(preEmbed);
      }else{
        message.channel.send({embed: new Discord.RichEmbed().setTitle(responses.nobot.title).setColor(responses.nobot.color)})
      }
    }else{
      message.channel.send({embed: new Discord.RichEmbed()
                            .setTitle(responses.usage.title)
                            .setDescription(prefix + commands.prefix.desc)
                            .setColor(responses.usage.color)
                           })
    }
    }
  
  if(command == 'invite'){
    if(message.mentions.members.first()){
      if(message.mentions.members.first().user.bot){
        let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
        if(!botInfo) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
        botInfo = botInfo.value();
        
        let preEmbed = new Discord.RichEmbed()
        .setColor(commands.stand)
        .setTitle('Invite | ' + message.mentions.members.first().user.tag)
        .addField('Invite', `https://discordapp.com/oauth2/authorize?&client_id=${botInfo.id}&scope=bot&permissions=8`);
        message.channel.send(preEmbed);
      }else{
        message.channel.send({embed: new Discord.RichEmbed().setTitle(responses.nobot.title).setColor(responses.nobot.color)})
      }
    }else{
      message.channel.send({embed: new Discord.RichEmbed().setTitle(responses.usage.title).setColor(responses.usage.color)})
    }
  }
  
  if(command == 'helpcommand'){
    if(message.mentions.members.first()){
      if(message.mentions.members.first().user.bot){
        let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
        if(!botInfo) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
        botInfo = botInfo.value();
        
        let preEmbed = new Discord.RichEmbed()
        .setColor(commands.stand)
        .setTitle('Help Command | ' + message.mentions.members.first().user.tag)
        .addField('Command:', `${botInfo.hc}`);
        message.channel.send(preEmbed);
      }else{
        message.channel.send({embed: new Discord.RichEmbed().setTitle(responses.nobot.title).setColor(responses.nobot.color)})
      }
    }else{
      message.channel.send({embed: new Discord.RichEmbed().setTitle(responses.usage.title).setColor(responses.usage.color).setDescription(prefix + commands.helpcommand.desc)})//+helpcommand <bot mention>');
    }
      }
  
  if(command == 'help') {
      
    let help = new Discord.RichEmbed()
      .setColor(commands.stand)
      .setTitle('Commands')
      .addField('db,queue', 'View the bot queue')
      .addField('db,token <Your Bot Mention>', 'get your bot dbtoken')
      .addField('db,approve', 'Approve first bot in queue')
      .addField('db,decline <reason>', 'Decline first bot in queue')
      .addField('db,prefix <Bot mention>', 'Get a bot\'s prefix')
      .addField('db,invite', 'Get a bot\'s invite link')
      .addField('db,owner <Bot mention>', 'Get a bot\'s owner')
      .addField('db,helpcommand <Bot mention>', 'Get a bot\'s help command')
      .addField('db,delete <Bot mention>', 'Delete a bot!')
      .addField('db,set <Bot mention> <prefix | help command> <new value>', 'Edit a bot')
      .addField('db,botinfo <Bot mention>', 'Get info about a bot!');
    
    message.channel.send(help);
  }
  
  if(command == 'delete'){
    if(message.mentions.members.first()){
      if(message.mentions.members.first().user.bot){
        
        let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
        if(!botInfo) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
        botInfo = botInfo.value();
        
        if(message.member.roles.find('name', 'Moderators')){
          
          process.DB.get('bots').remove({id: message.mentions.members.first().user.id});
          
          message.mentions.members.first().kick().then(() => {
            message.channel.send({embed: new Discord.RichEmbed()
                                  .setTitle("Deleted")
                                  .setColor(commands.delete.delete.color)
                                 })
            bot.channels.get("437198372684693518").send({embed: new Discord.RichEmbed()
                                                   .setTitle('DISCORD BOTS NATION - Bot Deleted')
                                                   .addField(`Bot`, `${message.mentions.members.first().user.tag}`)
                                                   .addField(`Moderator`, `${message.author.tag}`)
                                                   .setColor(commands.stand)}) 
            
          });
        } else {
          return message.channel.send({embed: new Discord.RichEmbed()
                                       .setTitle(responses.noperms.title)
                                       .setColor(responses.noperms.color)
                                      })
        }
      }else{
        message.channel.send({embed: new Discord.RichEmbed()
                              .setTitle(responses.nobot.title)
                              .setColor(responses.nobot.color)
                             })
      }
    }else{
      message.channel.send({embed: new Discord.RichEmbed()
                            .setTitle(responses.usage.title)
                            .setDescription(prefix + commands.delete.desc)
                            .setColor(responses.usage.color)
                           })
    }
  }
  
  if(command == 'set'){
    if(message.mentions.members.first()){
      if(message.mentions.members.first().user.bot){
        
        let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
        if(!botInfo) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.color)
                                                 })
        let botInfoValue = botInfo.value();
        
        if(botInfoValue.owner.includes(message.author.id) || message.member.roles.find('name', 'Moderators')){
          if(args[1]=='prefix'){
            botInfo.set('prefix', args.slice(2).join(' ')).write();
            message.channel.send({embed: new Discord.RichEmbed().setTitle(commands.set.fin).setColor(commands.stand)})
          }else if(args[1]=='help'){
            botInfo.set('hc', args.slice(2).join(' ')).write();
            message.channel.send({embed: new Discord.RichEmbed().setTitle(commands.set.fin).setColor(commands.stand)})
          }else if(args[1]=='description'||args[1]=='desc'){
            botInfo.set('desc', args.slice(2).join(' ')).write();
            message.channel.send({embed: new Discord.RichEmbed().setTitle(commands.set.fin).setColor(commands.stand)})
          }else if (args[1]=="github" || args[1]=='repository') {
            botInfo.set('git', args.slice(2).join(' ')).write();
            message.channel.send({embed: new Discord.RichEmbed().setTitle(commands.set.fin).setColor(commands.stand)})

          }
          else{
            return message.channel.send({embed: new Discord.RichEmbed().setTitle(responses.usage.title).setDescription(prefix + commands.set.desc).setColor(responses.usage.color)})

          }
        }
        else{
          return message.channel.send({embed: new Discord.RichEmbed()
                         .setTitle(responses.noperms.title)
                         .setColor(responses.noperms.color)
                        })
      }
        
          
      }else{
        return message.channel.send({embed: new Discord.RichEmbed()
                         .setTitle(responses.nobot.title)
                         .setColor(responses.nobot.color)
                        })
      }
    
    }else{
      message.channel.send({embed: new Discord.RichEmbed().setTitle(responses.usage.title).setDescription(prefix + commands.set.desc).setColor(responses.usage.color)})
  }}
  
  if(command == 'token'){
     //It just DMs the user always
      if(message.mentions.members.first()){
      if(message.mentions.members.first().user.bot){

          let botInfo = process.DB.get('bots').find({id:message.mentions.members.first().user.id});
          if(!botInfo.value()) return message.channel.send({embed: new Discord.RichEmbed()
                                                  .setTitle(responses.nolist.title)
                                                  .setColor(responses.nolist.title)
                                                 })
          let botInfoValue = botInfo.value();

          if(botInfoValue.owner.includes(message.author.id) || message.member.roles.find('name', 'Moderators')){
            var generator = require('generate-password');
            let newPass = generator.generate({
              length: 100,
              numbers: true,
              uppercase: false
            });
            
            
            botInfo.set('apiKey', newPass).write();
            message.author.send({embed: new Discord.RichEmbed()
                                 .setAuthor(message.author.tag, message.author.displayAvatarURL)
                                 .setTitle(`dbtoken for ${botInfoValue.name}`)
                                 .setDescription(`\`${newPass}\``)
                                 .setFooter('Don\'t not share your bot dbtoken with anyone!')
                                })
            message.channel.send('Please check your DMS for the dbtoken');
            console.log(botInfo.value());
            
          } else { 
            return message.channel.send({embed: new Discord.RichEmbed()
                                         .setTitle(responses.noperms.title)
                                         .setColor(responses.noperms.color)})
          }
        }else{
          message.channel.send({embed: new Discord.RichEmbed()
                         .setTitle(responses.nobot.title)
                         .setColor(responses.nobot.color)
                        })
        }
      }else{
        message.channel.send({embed: new Discord.RichEmbed()
                              .setTitle(responses.usage.title)
                              .setDescription(commands.token.desc)
                              .setColor(responses.usage.color)
                             })
      }
    }
  
  if(command == 'certify') {
    const no_args = new Discord.RichEmbed()
    .setTitle(responses.usage.title)
    .setDescription(prefix + commands.verified.desc)
    .setColor(responses.usage.color)

    const no_bot = new Discord.RichEmbed()
    .setTitle("That is not a valid bot")
    .setColor("RED")

    if(!message.mentions.users.first()) return message.channel.send(no_bot)                 
    if(!message.mentions.users.first().bot) return message.channel.send(no_bot)
    
    const m_bot = message.mentions.users.first()
    if(!cqueue[0]) return message.channel.send({embed: new Discord.RichEmbed().setTitle(responses.nolist.title).setColor(responses.nolist.color)})
    if(!args[1]) return message.channel.send(no_args)

    if(args[1] === "add"){

        const accept = new Discord.RichEmbed()
        .setAuthor(m_bot.tag, m_bot.avatarURL)
        .setDescription(`${m_bot.username} is now a **certified** bot! 🎉`)
        .setColor("GREEN")

        const declined = new Discord.RichEmbed()
        .setAuthor(m_bot.tag, m_bot.avatarURL)
        .setDescription(`${m_bot.username} is already a certified bot.`)
        .setColor("RED")

        if(!test[m_bot.id].verified){
        if(!test[m_bot.id].verified) test[m_bot.id].verified = "true"
        message.channel.send(accept)

        fs.writeFile("verified.json", JSON.stringify(test, null, 2), (err) => {
            if (err) console.error(err)
          });

        }else{
            if(test[m_bot.id].verified){
                message.channel.send(declined)
            }
        }
        
    }

    if(args[1] === "remove"){
        const no_verified = new Discord.RichEmbed()
        .setAuthor(m_bot.tag, m_bot.avatarURL)
        .setDescription(`${m_bot.username} is not a verified bot.`)
        .setColor("RED")

        if(!test[m_bot.id].verified) return message.channel.send(no_verified)

        if(test[m_bot.id].verified){

            const deleted = new Discord.RichEmbed()
            .setAuthor(m_bot.tag, m_bot.avatarURL)
            .setDescription(`${m_bot.username} removed from verified bots.`)
            .setColor("GREEN")

            message.channel.send(deleted)

            delete test[m_bot.id].verified;

            fs.writeFile("verified.json", JSON.stringify(test, null, 2), (err) => {
                if (err) console.error(err)
              });

        }

    }}
});

bot.login(process.env.TOKENE);

module.exports = bot;