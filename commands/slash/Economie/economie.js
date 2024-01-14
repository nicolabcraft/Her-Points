const {
  EmbedBuilder,
  Collection,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fetch = require("node-fetch");
const https = require("https");
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
const cooldownco = new Collection();
const cooldownnum = new Collection();
const { convertMS } = require("discordutility");
let timeco = 7200000;
let timenum = 120000;

const mysql = require("mysql");

////////////////////////////
//       ECHEANCES      //
//////////////////////////

const echeances = {
  jour: {
    id: "daily",
    coints: 50,
    dayAdd: 1,
  },
  semaine: {
    id: "weekly",
    coints: 120,
    dayAdd: 7,
  },
  mois: {
    id: "monthly",
    coints: 200,
    dayAdd: 30.4167,
  },
};

const nombreConfig = 10

//////////////////////////
//         CODE        //
////////////////////////

module.exports = {
  name: "eco",
  description: "Replies with pong!",
  type: 1,
  options: [
    {
      name: "jour",
      description: "Récupérer votre argent quotidient",
      type: 1,
    },
    {
      name: "semaine",
      description: "Récupérer votre argent hebdomadaire",
      type: 1,
    },
    {
      name: "mois",
      description: "Récupérer votre argent mensuelles",
      type: 1,
    },
    {
      name: "couleur",
      description: "Tentez votre chance en choisissant la bonne couleur!",
      type: 1,
    },
    {
      name: "nombre",
      description: "Tentez votre chance en choisissant le bon numéro!",
      type: 1,
      options: [
        {
          name: "nombre",
          description: "Nombre choisit",
          type: 10,
          required: true,
          min_value: 1,
          max_value: nombreConfig,
        },
      ],
    },
    {
      name: "transfert",
      description: "Transférer l'argent de votre compte discord sur le manager",
      type: 1,
    },
    {
      name: "solde",
      description: "Savoir combien de points vous avez sur vos comptes",
      type: 1,
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
  /**
   * @param {import("../../../types.js").Bot} client
   * @param {import("discord.js").Interaction} interaction
   * @param {any} config
   */
  run: async (client, interaction, config) => {
    let url =
      config.Url +
      "?key=" +
      config.UrlKey +
      "&id=" +
      interaction.user.id +
      "&conf=" +
      config.Type;
    var connection = mysql.createConnection(config.Bdd);

    if (
      interaction.options._subcommand !== "ajouter" &&
      interaction.options._subcommand !== "retirer"
    ) {
      const [results] = await client.db.execute(
        `${client.dbTables.usersSelect} WHERE \`id\` = ? LIMIT 1`,
        [interaction.user.id]
      );

      if (results.length == 0)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(":x: | Vous n'êtes pas connecté!")
              .setColor("Red"),
          ],
          ephemeral: false,
          components: [],
        });
    }

    let settings = { method: "Get", agent: httpsAgent };

    function givecredits(endroit, nombre, type, remind, secondtable) {
      var datenow = Date.now();
      var datee = datenow.toString();
      var length = datenow.toString().length;
      var Now = datee.substr(0, length - 3);
      //var Now = Date.now()
      if (endroit == "discord") {
        var getcredits = `${client.dbTables.usersSelect} WHERE id='${interaction.user.id}'  LIMIT 1`;
        connection.query(getcredits, function (error, results) {
          var creditsActuels = results[0].balance;
          //var Newcredits = math.chain(creditsActuels).add(nombre);
          const Newcredits = Number(creditsActuels) + Number(nombre);
          var setCredits = `${
            client.dbTables.usersUpdate
          } SET balance='${Newcredits}',${type}='${Now}', ${secondtable}=${Date.now()} WHERE id='${
            interaction.user.id
          }'`;
          connection.query(setCredits, function (error) {
            if (error) {
              console.log(error);
            }
            return interaction.reply({
              content: `<@${interaction.user.id}>`,
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `:white_check_mark: | Vous venez de gagner ${nombre} (discord)`
                  )
                  .setColor("Green"),
              ],
              ephemeral: false,
            });
          });
        });
      } else if (endroit == "manager") {
        if (config.Type == "1") {
          var setremind = `UPDATE users SET ${remind}="true" WHERE id='${interaction.user.id}'`;
          var getcredits = `SELECT * FROM users WHERE id='${interaction.user.id}'`;
          connection.query(getcredits, function (error, result) {
            var actualmail = result[0].email;
            var getcredits = `SELECT * FROM tblclients WHERE email='${actualmail}'`;
            connection.query(getcredits, function (error, results) {
              var creditsActuels = results[0].credit;
              //var Newcredits = math.chain(creditsActuels).add(nombre);
              const Newcredits = Number(creditsActuels) + Number(nombre);
              var setCredits = `UPDATE tblclients SET credit='${Newcredits}' WHERE email='${actualmail}'`;
              var Setaa = `UPDATE users SET ${type}='${Now}', ${secondtable}=${Date.now()} WHERE id='${
                interaction.user.id
              }'`;
              connection.query(setCredits, function () {
                connection.query(Setaa, function (error) {
                  if (error) {
                    console.log(error);
                  }
                  connection.query(
                    setremind,
                    function () {}
                  );
                });
                return interaction.reply({
                  content: `<@${interaction.user.id}>`,
                  embeds: [
                    new EmbedBuilder()
                      .setDescription(
                        `:white_check_mark: | Vous venez de gagner ${nombre} (manager)`
                      )
                      .setColor("Green"),
                  ],
                  ephemeral: false,
                });
              });
            });
          });
        } else {
          if (config.Type == "2") {
            var setremind = `UPDATE botusers SET ${remind}="true" WHERE id='${interaction.user.id}'`;
            var getcredits = `SELECT * FROM botusers WHERE id='${interaction.user.id}'`;
            connection.query(getcredits, function (error, result) {
              var actualmail = result[0].email;
              var getcredits = `SELECT * FROM users WHERE email='${actualmail}'`;
              connection.query(getcredits, function (error, results) {
                var creditsActuels = results[0].money;
                //var Newcredits = math.chain(creditsActuels).add(nombre);
                const Newcredits = Number(creditsActuels) + Number(nombre);
                var setCredits = `UPDATE users SET money='${Newcredits}', ${secondtable}=${Date.now()} WHERE email='${actualmail}'`;
                var Setaa = `UPDATE botusers SET ${type}='${Now}' WHERE id='${interaction.user.id}'`;
                connection.query(setCredits, function () {
                  connection.query(Setaa, function (error) {
                    if (error) {
                      console.log(error);
                    }
                    connection.query(
                      setremind,
                      function () {}
                    );
                  });
                  return interaction.reply({
                    content: `<@${interaction.user.id}>`,
                    embeds: [
                      new EmbedBuilder()
                        .setDescription(
                          `:white_check_mark: | Vous venez de gagner ${nombre} (manager)`
                        )
                        .setColor("Green"),
                    ],
                    ephemeral: false,
                  });
                });
              });
            });
          }
        }
      }
    }

    //////////////////////////
    //      ECHEANCES      //

    if (Object.keys(echeances).includes(interaction.options._subcommand))
      fetch(url, settings)
        .then((res) => res.json())
        .then((json) => {
          client.db
            .execute(
              `${client.dbTables.usersSelect} WHERE \`id\` = ?  LIMIT 1`,
              [interaction.user.id]
            )
            .then(function ([results]) {
              const echeanceFound = Object.entries(echeances).find(
                ([key]) => key == interaction.options._subcommand
              );
              const [echeanceKey, { id: echeanceId, coints: echeanceCoins, dayAdd: echeanceDayAdd }] =
                echeanceFound;

              var AAAAAAbb = results[0];
              var dateFormat = new Date(Number(AAAAAAbb[echeanceId]));
              dateFormat.setDate(dateFormat.getDate() + echeanceDayAdd);
              const converted = convertMS(
                //math.chain(dateFormat.valueOf()).subtract(Date.now())
                Number(dateFormat.valueOf()) - Date.now()
              ); // Donne 19430j

              
              if (interaction.options._subcommand == echeanceKey) {
                console.log(AAAAAAbb, json, echeanceId)
                if (!json[echeanceId]) {
                  // if user on cooldown
                  //add message here if code
                  interaction.reply({
                    content: `<@${interaction.user.id}>`,
                    embeds: [
                      new EmbedBuilder()
                        .setDescription(
                          "Vous devez encore patienter: \n" +
                            `${converted["d"]} jour, ${converted["h"]} heures, ${converted["m"]} minutes, ${converted["s"]} secondes.`
                        )
                        .setColor("Red"),
                    ],
                    ephemeral: false,
                  });
                } else {
                  let gettransf = `${client.dbTables.usersSelect} WHERE id=${interaction.user.id}  LIMIT 1`;
                  client.db.execute(gettransf).then(function ([results]) {
                    console.log([
                      (results[0].autotransfert = "off")
                        ? "discord"
                        : "manager",
                      echeanceCoins,
                      `${echeanceKey}time`,
                      `${echeanceKey}remind`,
                      echeanceKey
                    ])
                    givecredits(
                      (results[0].autotransfert = "off")
                        ? "discord"
                        : "manager",
                      echeanceCoins,
                      `${echeanceKey}time`,
                      `${echeanceKey}remind`,
                      echeanceKey
                    );
                  });
                }
              }
            })
            .catch((err) =>
              {
                client.logger("DB-ERR", err, "DarkRed"); console.error(err);
                interaction.reply({
                content: `<@${interaction.user.id}>`,
                embeds: [
                  new EmbedBuilder()
                    .setDescription(
                      `:x: | Une erreur à été rencontrée lors de la connexion avec la base de données.`
                    )
                    .setColor("Red"),
                ],
                ephemeral: false,
              })}
            );
        });

    //////////////////////////

    if (interaction.options._subcommand == "couleur") {
      const colors = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("yellow")
          .setLabel("🟡 Jaune")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("red")
          .setLabel("🔴 Rouge")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("green")
          .setLabel("🟢 Vert")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("blue")
          .setLabel("🔵 Bleu")
          .setStyle(ButtonStyle.Success)
      );
      if (cooldownco.has(interaction.user.id)) {
        // if user on cooldown
        const timeLeft = cooldownco.get(interaction.user.id) - Date.now();
        const converted = convertMS(timeLeft); // Changes the ms to time
        //add message here if code
        interaction.reply({
          content: `<@${interaction.user.id}>`,
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "Vous devez encore patienter: \n" +
                  `${converted["d"]} jours, ${converted["h"]} heures, ${converted["m"]} minutes, ${converted["s"]} secondes.`
              )
              .setColor("Red"),
          ],
          ephemeral: false,
        });
      } else {
        cooldownco.set(interaction.user.id, Date.now() + timeco); // <- saves the time
        setTimeout(() => cooldownco.delete(interaction.user.id), timeco); // <- I don't remember what it does but it's needed
        interaction.reply({
          content: `<@${interaction.user.id}>`,
          embeds: [
            new EmbedBuilder().setDescription(
              `Choisissez l'une des couleurs ci-dessous.`
            ),
            // .setColor('')
          ],
          ephemeral: false,
          components: [colors],
        });
      }
    }

    if (interaction.options._subcommand == "nombre") {
      const entierAleatoire = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

      if (cooldownnum.has(interaction.user.id)) {
        // if user on cooldown
        const timeLeft = cooldownnum.get(interaction.user.id) - Date.now();
        const converted = convertMS(timeLeft); // Changes the ms to time
        //add message here if code
        interaction.reply({
          content: `<@${interaction.user.id}>`,
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "Vous devez encore patienter: \n" +
                  `${converted["d"]} jours, ${converted["h"]} heures, ${converted["m"]} minutes, ${converted["s"]} secondes.`
              )
              .setColor("Red"),
          ],
          ephemeral: false,
        });
      } else {
        cooldownnum.set(interaction.user.id, Date.now() + timenum); // <- saves the time
        setTimeout(() => cooldownnum.delete(interaction.user.id), timenum);
        var add = entierAleatoire(10, nombreConfig);
        var nbchoisis = entierAleatoire(1, nombreConfig);

        function win() {
          let gettime = `${client.dbTables.usersSelect} WHERE id=${interaction.user.id}  LIMIT 1`;

          client.db
            .execute(gettime)
            .then(function ([results]) {
              var old_balance = results[0].balance;

              var oldbal = old_balance;
              // var newbal = math.evaluate(oldbal+coins_daily)
              //var newbal = math.chain(add).add(oldbal);
            })
            .catch((err) =>
              {
                client.logger("DB-ERR", err, "DarkRed"); console.error(err);
                interaction.reply({
                content: `<@${interaction.user.id}>`,
                embeds: [
                  new EmbedBuilder()
                    .setDescription(
                      `:x: | Une erreur à été rencontrée lors de la connexion avec la base de données.`
                    )
                    .setColor("Red"),
                ],
                ephemeral: false,
              })}
            );
          if (autotransfert == "off") {
            givecredits("discord", add);
          } else {
            givecredits("manager", add);
          }
        }

        function lost() {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("Perdu! La solution était: " + nbchoisis)
                .setColor("Red"),
            ],
            ephemeral: false,
            components: [],
          });
        }

        if (interaction.options.get("nombre") == nbchoisis) {
          win();
        } else {
          lost();
        }
      }
    }

    if (interaction.options._subcommand == "transfert") {
      var Verifsiilestconnecté = `${client.dbTables.usersSelect} WHERE id="${interaction.user.id}" LIMIT 1`;
      client.db.execute(Verifsiilestconnecté).then(function ([results]) {
        var résultats = results.length;

        if (résultats == 0) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(":x: | Vous n'êtes pas connecté!")
                .setColor("Red"),
            ],
            ephemeral: false,
            components: [],
          });
        } else {
          var GetOlbBal = `${client.dbTables.usersSelect} WHERE id="${interaction.user.id}"  LIMIT 1`;
          client.db
            .execute(GetOlbBal)
            .then(function ([results]) {
              var GetBal = `${client.dbTables.clientSelect} WHERE email="${results[0].email}"  LIMIT 1`;

              client.db.execute(GetBal).then(function ([rows]) {
                var balmanager =
                  config.Type == "1" ? rows[0].credit : rows[0].money;
                var baldiscord = results[0].balance;
                //var newbal = math.chain(balmanager).add(baldiscord);
                const newbal = Number(balmanager) + Number(baldiscord);

                var addpoints = `${client.dbTables.clientUpdate} SET ${
                  config.Type == "1" ? "credit" : "money"
                }="${newbal}.00" WHERE email="${results[0].email}"`;
                client.db.execute(addpoints).then(function ([]) {
                  var retirerpoints = `${client.dbTables.usersUpdate} SET balance="0" WHERE id="${interaction.user.id}"`;
                  client.db.execute(retirerpoints).then(function ([]) {
                    return interaction.reply({
                      content: `<@${interaction.user.id}>`,
                      embeds: [
                        new EmbedBuilder()
                          .setDescription(
                            "Vous avez transféré " +
                              baldiscord +
                              " points sur le manager!\nVous disposez maintenant de " +
                              newbal +
                              " points!"
                          )
                          .setColor("Green"),
                      ],
                      ephemeral: false,
                    });
                  });
                });
              });
            })
            .catch((err) =>
              {
                client.logger("DB-ERR", err, "DarkRed"); console.error(err);
                interaction.reply({
                content: `<@${interaction.user.id}>`,
                embeds: [
                  new EmbedBuilder()
                    .setDescription(
                      `:x: | Une erreur à été rencontrée lors de la connexion avec la base de données.`
                    )
                    .setColor("Red"),
                ],
                ephemeral: false,
              })}
            );
        }
      });
    }

    if (interaction.options._subcommand == "solde") {
      var aa = `${client.dbTables.usersSelect} WHERE id="${interaction.user.id}" LIMIT 1`;
      client.db.execute(aa).then(function ([rows]) {
        var bb = `${client.dbTables.clientSelect} WHERE email='${rows[0].email}'  LIMIT 1`;
        client.db.execute(bb).then(function ([rowsss]) {
          return interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `Vous disposez de ${
                    rows[0].balance
                  } points sur votre compte discord et de ${
                    config.Type == "1" ? rowsss[0].credit : rowsss[0].money
                  } points sur le manager.`
                )
                .setColor("Green"),
            ],
            ephemeral: false,
          });
        });
      });
    }
  },
};
