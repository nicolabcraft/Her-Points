const fs = require("fs");
const colors = require("colors");
const path = require("path");
const globSync = require("glob").sync;

module.exports = (client, config) => {
  console.log("0------------------| Prefix Handler:".blue);

  const files = globSync(path.resolve(__dirname, "../commands/prefix/**/*.js"));

  files.forEach((file) => {
      if(!file.endsWith('.js') || file.startsWith(".")) return;
      let pull = require(file);
      if (pull.config.name) {
        client.prefix_commands.set(pull.config.name, pull);
        console.log(`[HANDLER - PREFIX] Fichier chargé: ${pull.config.name} (#${client.prefix_commands.size})`.brightGreen)
      } else {
        console.log(`[HANDLER - PREFIX] Impossible de charger le fichier ${file}, missing module name value.`.red)
      };
  });
};
