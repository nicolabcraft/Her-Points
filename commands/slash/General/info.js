const { EmbedBuilder, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "info", // Name of command
    description: "Vérifier les informations d'un utilisateur", // Command description
    type: 1, // Command type
    options: [
        {
            name: "user",
            description: "Utilisateur à vérifier",
            type: 6,
            required: true
        }
    ], // Command options
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        var aa = `SELECT * FROM users WHERE id="${interaction.user.id}"`
        connection.query(aa, function (err, rows, fields) {
            var bb = `SELECT * FROM tblclients WHERE email='${rows[0].email}'`
            connection.query(bb, function (err, rowsss, fields) {
                const user = interaction.options.getUser('user');
                const member = interaction.options.getMember('user');
                const embed = new EmbedBuilder()
                    .setTitle(`Informations de ${user.tag}`)
                    .addField("Nom d'utilisateur", user.username, true)
                    .addField(`Solde`, rows[0].balance, true)
                    .addField(`Crédit`, rowsss[0].credit, true)
                    .addField("Email", rows[0].email, true)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setColor("RANDOM");
                interaction.reply({ embeds: [embed], ephemeral: true });
            })})
    },
};
