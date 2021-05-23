const db = require("quick.db");
const fs = require("fs");
const wiodb = require("wio.db");
const ms = require("ms");
const Canvas = require("canvas");
const ayarlar = require("./ayarlar.json");
require("./invite.js");
require("events").EventEmitter.prototype._maxListeners = 70;
require("events").defaultMaxListeners = 70;
process.on("warning", function(err) {
  if ("MaxListenersExceededWarning" == err.name) {
    process.exit(1);
  }
});

const log = message => {
  console.log(`${message}`);
  {
    console.log(` ${message}`);
  }
};
function foo() {
  return new Promise((resolve, reject) => {
    return resolve();
  });
}
async function foobar() {
  foobar();
  foo()
    .then(() => {})
    .catch(() => {});
  foobar().catch(console.error);
}

var prefix = ayarlar.prefix;

const Discord = require("discord.js");
const client = new Discord.Client({ partials: ["MESSAGE", "REACTION"] });
Discord.Role.prototype.toString = function() {
  return `@${this.name}`;
};

require("./util/eventLoader.js")(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (ayarlar.sahip.includes(message.author.id)) permlvl = 4;
  return permlvl;
};

client.login(process.env.token).then(
  function() {
    console.log("[Token-Log] Token doğru bir şekilde çalışıyor.");
  },
  function(err) {
    console.log("[ERROR] Token'de bir hata oluştu: " + err);
    setInterval(function() {
      process.exit(0);
    }, 20000);
  }
);

//-----------------BOTUN_SESLİDE_KALMASI

const Discord1 = require("discord.js");
const client2 = new Discord.Client();
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log("Streamstatus AKIYORR");

  client.user
    .setActivity(`Synayzen lvar 💕 Assassin's Creed Family`, {
      type: "STREAMING",
      url: "https://www.twitch.tv/synayzen"
    })
    .then(presence =>
      console.log(
        `HAZIR KAPTAN ASSASSİNS!  ${presence.game ? presence.game.none : "🛠"}`
      )
    )
    .catch(console.error);
});

//-----------------------------//
//_------------------------------------------------------//

client.on("ready", () => {
  client.channels.cache.get("801730967910875188").join();
});

//--------------------BOT_MESAJ--------------------------//

client.on("message", msg => {
  var dm = client.channels.cache.get("801730957190365194");
  if (msg.channel.type === "dm") {
    if (msg.author.id === client.user.id) return;
    const botdm = new Discord.MessageEmbed()
      .setTitle(`${client.user.username} Dm`)
      .setTimestamp()
      .setColor("#d402db")
      .setThumbnail(`${msg.author.avatarURL()}`)
      .addField("Gönderen", msg.author.tag)
      .addField("Gönderen ID", msg.author.id)
      .addField("Gönderilen Mesaj", msg.content);
    dm.send("<@&799724043879317544>");
    dm.send(botdm);
  }
  if (msg.channel.bot) return;
});
