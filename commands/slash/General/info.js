const { EmbedBuilder, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, PermissionsBitField } = require("discord.js");
const config = require('../../../config/config.js');
const mysql = require('mysql');
var connection = mysql.createConnection(config.Bdd);
module.exports = {
    name: "info", // Name of command
    description: "Vérifier les informations d'un utilisateur", // Command description
    type: 1, // Command type
    options: [
        {
            name: "utilisateur",
            description: "Utilisateur à vérifier",
            type: 6,
            required: true
        }
    ], // Command options
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        var userr = interaction.options.get('utilisateur') 
        var user = userr.user.id
        verifsico = `SELECT * FROM users WHERE id ="${user}"`
        connection.query(gettimef(), function(error, results, fields) {
            if(results.length == 0){
                interaction.reply({
                    embeds: [
                    new EmbedBuilder()
                        .setTitle(`Informations de ${user.tag}`)
                        .addFields(
                            {name:"ID", value: user.id.toString(), inline: true},
                            {name:"Nom d'utilisateur", value: user.username, inline: true},
                            {name:"Status", value: "Utilisateur non enregistré", inline: true},
                        )
                        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    ],
                    ephemeral: false,
                    components: [],
                });
            }else{
                var connection = mysql.createConnection(config.Bdd);
                var aa = `SELECT * FROM users WHERE id="${interaction.user.id}"`
                connection.query(aa, function (err, rows, fields) {
                    var bb = `SELECT * FROM tblclients WHERE email='${rows[0].email}'`
                    connection.query(bb, function (err, rowsss, fields) {
                        const user = interaction.options.getUser('user');
                        const member = interaction.options.getMember('user');
                        const embed = new EmbedBuilder()
                            .setTitle(`Informations de ${user.tag}`)
                            .addFields(
                                {name:"ID", value: user.id.toString(), inline: true},
                                {name:"Nom d'utilisateur", value: user.username, inline: true},
                                {name:"Solde (Discord)", value: rows[0].balance, inline: true},
                                {name:"Crédit (En ligne)", value: rowsss[0].credit.toString(), inline: true},
                                {name:"Email", value: rows[0].email, inline: true}
                            )
                            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                        interaction.reply({ embeds: [embed], ephemeral: true });
                    })})
                }})
                function verifsico(){
                    if(config.Type == "1"){
                        var Verifsiilestconnecté = `SELECT * FROM users WHERE id="${interaction.user.id}"`
                        connection.query(Verifsiilestconnecté, function(error, results, fields) {
                            var résultats = results.length
                            console.log(résultats)
                            if(résultats == "0"){
                                return false;
                            }
                        })
                    }else{
                        if(config.Type == "2"){
                            var Verifsiilestconnecté = `SELECT * FROM botusers WHERE id="${interaction.user.id}"`
                            connection.query(Verifsiilestconnecté, function(error, results, fields) {
                                var résultats = results.length
                                if(résultats == 0){
                                    return "false";
                                }
                            })
                        }
                    }
                }
                function gettimef(){
                    if(config.Type == "1"){
                        return "SELECT * FROM users";
                    }else{
                        if(config.Type == "2"){
                            return "SELECT * FROM botusers";
                        }
                    }
                }

    },
};

