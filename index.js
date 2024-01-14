const {
  Client,
  Partials,
  Collection,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");
const config = require("./config/config.js");
const colors = require("colors");
const mysql2 = require("mysql2/promise.js");
const mysql = require("mysql");
const fetch = require("node-fetch");
const https = require("https");
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// --- GIT CHECK ---

const gitCheckActive = config?.GitAutoUpdate?.enable;
if (gitCheckActive) {
  console.log("[INFO] Git auto update is enabled.");
  const gitCheck = require("./check-git.js");
  gitCheck();
  setInterval(gitCheck, (config.GitAutoUpdate?.interval || 5) * 60000);
} else {
  console.log("[INFO] Git auto update is disabled.");
}

// --- END GIT CHECK ---

// --- CLIENT CREATE ---

/** @type {import("./types.d.ts").Bot}} */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
  presence: {
    activities: [
      {
        name: config.Divers.activité,
        type: 0,
      },
    ],
    status: "dnd",
  },
});

// --- END CLIENT CREATE ---

// Host the bot:
// require('http').createServer((req, res) => res.end('Ready.')).listen(3000);

// --- LOGIN ---

const AuthenticationToken = process.env.TOKEN || config.Client.TOKEN;
if (!AuthenticationToken) {
  console.warn("[CRASH] Token non inscrit!".red);
  return process.exit();
}

// --- END LOGIN ---

// --- HANDLERS ---

module.exports = client;

client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();
["prefix", "application_commands", "modals", "events"].forEach((file) => {
  require(`./handlers/${file}`)(client, config);
});

// --- END HANDLERS ---

// --- DB ---

const connection = mysql.createConnection(config.Bdd);

client.db = null;
mysql2.createConnection(config.Bdd).then((conn) => (client.db = conn));
/* client.dbStatement = (query, args) =>
  client.db.prepare(query).then(async (s) => {
    const res = await s.execute(args);
    s.close();
    const result = res[0];

    return (Array.isArray(result) || result[Symbol.iterator])
      ? result 
      : [result];
  });
 */
// --- END DB ---

// Login to the bot:
client.login(AuthenticationToken).catch((err) => {
  console.error("[CRASH] Erreur rencontré lors du lancement du bot");
  console.error("[CRASH] Erreur Discord API:" + err);
  return process.exit();
});

// --- PROCESS ---

// Handle errors
process.on("unhandledRejection", async (err, promise) => {
  console.error(`[ANTI-CRASH]: ${err}`.red);
  console.error(promise);
});

// On quit
process.on("SIGINT", async function () {
  console.log("Caught interrupt signal");
  await client.destroy();
  connection.end();
  client.db.end();
  console.log("[INFO] Bot déconnecté à " + new Date().toISOString());
  process.exit();
});

// --- END PROCESS ---

// --- REMIND ---

module.exports.Remind = function () {
  const GuildList = client.guilds.cache.get(config.ServeurID);
  GuildList.members.cache.forEach((member) => SendRemind(member.id));
};

function SendRemind(userID) {
  let url =
    config.Url +
    "?key=" +
    config.UrlKey +
    "&id=" +
    userID +
    "&conf=" +
    config.Type;

  if (config.Type == "1") {
    VerifSiCo = `SELECT * FROM users WHERE id = ${userID}  LIMIT = 1`;
    connection.query(VerifSiCo, function (error, results, fields) {
      if (results.length == 0) {
        return;
      } else {
        let settings = { method: "Get", agent: httpsAgent };
        fetch(url, settings)
          .then((res) => res.json())
          .then((json) => {
            if (json.dailyremind == "true" && json.daily == "true") {
              client.users.cache.get(userID).send({
                embeds: [
                  new EmbedBuilder()
                    .setDescription(
                      `Salut! \nLa commande </eco jour:${client.user.id}> est prête!`
                    )
                    .setFooter({
                      text: "Envoyé automatiquement " + client.user.tag,
                    }),
                ],
              });
              DisableDailyRemind = `UPDATE users SET dailyremind="false"`;
              connection.query(
                DisableDailyRemind,
                function (error, results, fields) {
                  if (error) {
                    client.users.cache.get(userID).send({
                      embeds: [
                        new EmbedBuilder()
                          .setDescription(
                            `Vous risquez de reçevoir un deuxième message, identique à celui ci-dessus car une erreur s'est produite.`
                          )
                          .setFooter({
                            text: "Envoyé automatiquement " + client.user.tag,
                          })
                          .setColor("Red"),
                      ],
                    });
                  }
                }
              );
            }
            if (json.weeklyremind == "true" && json.weekly == "true") {
              client.users.cache.get(userID).send({
                embeds: [
                  new EmbedBuilder()
                    .setDescription(
                      `Salut! \nLa commande </eco semaine:${client.user.id}> est prête!`
                    )
                    .setFooter({
                      text: "Envoyé automatiquement " + client.user.tag,
                    }),
                ],
              });
              DisableWeeklyRemind = `UPDATE users SET weeklyremind="false"`;
              connection.query(
                DisableWeeklyRemind,
                function (error, results, fields) {
                  if (error) {
                    client.users.cache.get(userID).send({
                      embeds: [
                        new EmbedBuilder()
                          .setDescription(
                            `Vous risquez de reçevoir un deuxième message, identique à celui ci-dessus car une erreur s'est produite.`
                          )
                          .setFooter({
                            text: "Envoyé automatiquement " + client.user.tag,
                          })
                          .setColor("Red"),
                      ],
                    });
                  }
                }
              );
            }
            if (json.monthlyremind == "true" && json.monthly == "true") {
              client.users.cache.get(userID).send({
                embeds: [
                  new EmbedBuilder()
                    .setDescription(
                      `Salut! \nLa commande </eco mois:${client.user.id}> est prête!`
                    )
                    .setFooter({
                      text: "Envoyé automatiquement " + client.user.tag,
                    }),
                ],
              });
              DisableMonthlyRemind = `UPDATE users SET monthlyremind="false"`;
              connection.query(
                DisableMonthlyRemind,
                function (error, results, fields) {
                  if (error) {
                    client.users.cache.get(userID).send({
                      embeds: [
                        new EmbedBuilder()
                          .setDescription(
                            `Vous risquez de reçevoir un deuxième message, identique à celui ci-dessus car une erreur s'est produite.`
                          )
                          .setFooter({
                            text: "Envoyé automatiquement " + client.user.tag,
                          })
                          .setColor("Red"),
                      ],
                    });
                  }
                }
              );
            }
          });
      }
    });
  } else {
    if (config.Type == "2") {
      VerifSiCo = `SELECT * FROM botusers WHERE id = ${userID}`;
      connection.query(VerifSiCo, function (error, results, fields) {});
    }
  }
}

// --- END REMIND ---

// --- DB PREREQUESTS ---

const dbTables = {
  usersSelect:
    config.Type == "1"
      ? "SELECT * FROM `users`"
      : "SELECT * FROM `botusers`",
  usersUpdate: config.Type == "1" ? "UPDATE `users`" : "UPDATE `botusers`",
  clientSelect:
    config.Type == "1"
      ? "SELECT * FROM `tblclients`"
      : "SELECT * FROM `users`",
      clientUpdate: config.Type == "1" ? "UPDATE `tblclients`" : "UPDATE `users`",
};
client.dbTables = dbTables;
