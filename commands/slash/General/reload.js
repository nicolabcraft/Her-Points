const { EmbedBuilder, Collection, ActionRowBuilder, StringSelectMenuBuilder,ButtonBuilder, ButtonStyle, Events, PermissionsBitField } = require("discord.js");
const config = require('../../../config/config.js');
const mysql = require('mysql');

//////////////////////////
//         CODE        //
////////////////////////

module.exports = {
    name: "reload",
    description: "Reload Admin",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
                return;
            }else{
                    const embeddrop = new EmbedBuilder()
                    .setTitle(`Reload`)
                    .setDescription(
                        `Le bot a été redémarré avec succès.                        
                         Date:  ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}`
                    )
                interaction.reply({ embeds: [embeddrop], components: [], ephemeral: true, });
                setTimeout(() => {
                    console.log(`[INFO] Bot redémarré avec succès ! Date: ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}`)
                    process.exit();
                }, 500);
            }
    },
};