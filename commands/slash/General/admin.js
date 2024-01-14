const { EmbedBuilder, Collection, ActionRowBuilder, StringSelectMenuBuilder,ButtonBuilder, ButtonStyle, Events, PermissionsBitField } = require("discord.js");
const config = require('../../../config/config.js');

const mysql = require('mysql');


////////////////////////////
//      COINS DONNÉS     //
//////////////////////////

var coins_daily = "60"
var coins_weekly = "120"
var coins_monthly = "200"

//////////////////////////
//         CODE        //
////////////////////////

module.exports = {
    name: "admin",
    description: "Configurations Admin",
    type: 1,
    options: [
        {
            name: "config",
            description: "Configuration admin",
            type: 1,
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
        if(interaction.options._subcommand == "config"){
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
                return;
            }else{
                const colors = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('SelectAdminConfig')
                            .setPlaceholder('Clique moi dessus!')
                            .addOptions(
                                {
                                    label: 'Connexions multiples',
                                    description: 'Activez/Désactivez les connexions multiples',
                                    value: 'multiplesconnexions',
                                },
                            ),
                    );
        
                const embeddrop = new EmbedBuilder()
                    .setTitle(`Configurations des paramètres`)
                    .setDescription(
                        `Menu des préférences d'aministration
                        
                        Vous utilisez la version ${config.Divers.version}`
                    )
                interaction.reply({ embeds: [embeddrop], components: [colors], ephemeral: true, });
            }}
    },
};