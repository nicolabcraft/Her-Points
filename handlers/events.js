const fs = require("fs");
const colors = require("colors");
const path = require("path");
const globSync = require("glob").sync;

module.exports = (client) => {
  console.log("0------------------| Events Handler:".blue);
  globSync(path.resolve(__dirname, "../events/**/*.js")).forEach((file) => {
    let pull = require(file);
    if (pull.name) {
      client.events.set(pull.name, pull);
      console.log(
        `[HANDLER - EVENTS] Fichier chargé: ${pull.name} (#${client.events.size})`
          .brightGreen
      );
    } else {
      console.log(
        `[HANDLER - EVENTS] Couldn't load the file ${file}, missing module name value.`
          .red
      );
    }
  });
};
