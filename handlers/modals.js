const fs = require("fs");
const colors = require("colors");
const globSync = require("glob").sync;
const path = require("path");

module.exports = (client, config) => {
    console.log("0------------------| Modals Handler:".blue);

    const files = globSync(path.resolve(__dirname, "../modals/**/*.js"));

    files.forEach((file) => {
        if(!file.endsWith('.js') || file.startsWith(".")) return;
        let pull = require(file);
        if (pull.id) {
            client.modals.set(pull.id, pull);
            console.log(`[HANDLER - MODALS] Fichier chargé: ${file}`.brightGreen)
        } else {
            console.log(`[HANDLER - MODALS] Impossible de charger le fichier ${file}. ID du Modal non inscrit.`.red)
        }
    });
};
