const {
  EmbedBuilder,
  Collection,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  PermissionsBitField,
} = require("discord.js");
const fetch = require("node-fetch");
const https = require("https");
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
const config = require("../../../config/config.js");
const cooldownwe = new Collection();
const cooldownda = new Collection();
const cooldownco = new Collection();
const cooldownnum = new Collection();
const { convertMS } = require("discordutility");
let time = 86400000;
let timewe = 604800000;
let timeco = 7200000;
let timenum = 120000;
let timemo = 2628002880;

const mysql = require("mysql");

////////////////////////////
//      COINS DONNÉS     //
//////////////////////////

var coins_daily = "50";
var coins_weekly = "120";
var coins_monthly = "200";

////////////////////////////
//       ECHEANCES      //
//////////////////////////

const echeances = {
  jour: {
    id: "daily",
    coints: 50,
  },
  semaine: {
    id: "weekly",
    coints: 120,
  },
  mois: {
    id: "monthly",
    coints: 200,
  },
};

//////////////////////////
//         CODE        //
////////////////////////

module.exports = {
  name: "eco-admin",
  description: "Administration de l'économie",
  type: 1,
  options: [
    {
      name: "ajouter",
      description: "Ajouter des points",
      type: 1,
      options: [
        {
          name: "utilisateur",
          description: "Cible",
          type: 6,
          required: true,
          min_value: 1,
        },
        {
          name: "nombre",
          description: "Nombre choisit",
          type: 10,
          required: true,
          min_value: 1,
        },
      ],
    },
    {
      name: "retirer",
      description: "Retirer des points",
      type: 1,
      options: [
        {
          name: "utilisateur",
          description: "Cible",
          type: 6,
          required: true,
          min_value: 1,
        },
        {
          name: "nombre",
          description: "Nombre choisit",
          type: 10,
          required: true,
          min_value: 1,
        },
      ],
    },
  ],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "Administrator"
  },
  /**
   * @param {import("../../../types.js").Bot} client
   * @param {import("discord.js").Interaction} interaction
   * @param {any} config
   */
  run: async (client, interaction, config) => {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return;
    }

    const addRemove = {
      ajouter: 1,
      retirer: -1,
    };
    if (Object.keys(addRemove).includes(interaction.options._subcommand)) {
      const minus = addRemove[interaction.options._subcommand];
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        return;
      }
      var moneytoadd = interaction.options.get("nombre").value;
      const userr = interaction.options.get("utilisateur");
      const user = userr.user.id;
      const userId = userr.user.id || userr.value;
      var GetActualMoney = `${client.dbTables.usersSelect} WHERE id = ?  LIMIT 1`;
      const [rowsss] = await client.db.execute(GetActualMoney, [userId]);
      if (rowsss.length == 0) {
        return interaction.reply({
          content: `<@${interaction.user.id}>`,
          embeds: [
            new EmbedBuilder()
              .setDescription(`L'utilisateur n'est pas connecté.`)
              .setColor("Red"),
          ],
          ephemeral: true,
        });
      }
      var actualMoney = rowsss[0].balance;
      console.log({
        rowsss,
        actualMoney,
        moneytoadd,
        minus,
      })
      var NewBalance = Number(actualMoney) + Number(moneytoadd) * minus;
      var SetNewBalance = `${client.dbTables.usersUpdate} SET balance=? WHERE id=?`;
      client.db
        .execute(SetNewBalance, [NewBalance, user])
        .then(function ([rows]) {
          return interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `L'utilisateur dispose désormais de ${NewBalance} points.`
                )
                .setColor("Green"),
            ],
            ephemeral: true,
          });
        });
    }
  },
};
