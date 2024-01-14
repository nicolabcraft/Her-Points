const client = require("../index");
const { PermissionsBitField, Routes, REST, User } = require("discord.js");
const fs = require("fs");
const colors = require("colors");
const globSync = require("glob").sync;
const path = require("path");

module.exports = (client, config) => {
  console.log("0------------------| Application commands Handler:".blue);

  let commands = [];
  console.log("[!] Started loading slash commands...".yellow);

  // Slash commands handler:
  globSync(path.resolve(__dirname, "../commands/slash/**/*.js")).forEach(
    (file) => {
      let pull = require(file);

      if ((pull.name, pull.description, pull.type == 1)) {
        client.slash_commands.set(pull.name, pull);
        console.log(
          `[HANDLER - SLASH] Fichier chargé: ${pull.name} (#${client.slash_commands.size})`
            .brightGreen
        );
        commands.push({
          name: pull.name,
          description: pull.description,
          type: pull.type || 1,
          options: pull.options ? pull.options : null,
          default_permission: pull.permissions.DEFAULT_PERMISSIONS
            ? pull.permissions.DEFAULT_PERMISSIONS
            : null,
          default_member_permissions: pull.permissions
            .DEFAULT_MEMBER_PERMISSIONS
            ? PermissionsBitField.resolve(
                pull.permissions.DEFAULT_MEMBER_PERMISSIONS
              ).toString()
            : null,
        });
      } else {
        console.log(
          `[HANDLER - SLASH] Couldn't load the file ${file}, missing module name value, description, or type isn't 1.`
            .red
        );
      }
    }
  );

  console.log("[!] Started loading user commands...".yellow);

  // User commands handler:
  globSync(path.resolve(__dirname, "../commands/user/**/*.js")).forEach(
    (file) => {
      let pull = require(file);

      if ((pull.name, pull.type == 2)) {
        client.user_commands.set(pull.name, pull);
        console.log(
          `[HANDLER - USER] Fichier chargé: ${pull.name} (#${client.user_commands.size})`
            .brightGreen
        );
        commands.push({
          name: pull.name,
          type: pull.type || 2,
        });
      } else {
        console.log(
          `[HANDLER - USER] Couldn't load the file ${file}, missing module name value or type isn't 2.`
            .red
        );
      }
    }
  );

  console.log("[!] Started loading message commands...".yellow);

  // Message commands handler:
  globSync(path.resolve(__dirname, "../commands/message/**/*.js")).forEach(
    (file) => {
      let pull = require(file);

      if ((pull.name, pull.type == 3)) {
        client.message_commands.set(pull.name, pull);
        console.log(
          `[HANDLER - MESSAGE] Fichier chargé: ${pull.name} (#${client.user_commands.size})`
            .brightGreen
        );

        commands.push({
          name: pull.name,
          type: pull.type || 3,
        });
      } else {
        console.log(
          `[HANDLER - MESSAGE] Impossible de charger le fichier ${file}, missing module name value or type isn't 2.`
            .red
        );
      }
    }
  );

  // Registering all the application commands:
  if (!config.Client.ID) {
    console.log(
      "[CRASH] Vous devez inscrire l'ID de votre bot dans le fichier config.js!"
        .red + "\n"
    );
    return process.exit();
  }

  const rest = new REST({ version: "10" }).setToken(
    config.Client.TOKEN || process.env.TOKEN
  );

  (async () => {
    console.log("[HANDLER] Chargement des slash commands.".yellow);

    try {
      await rest.put(Routes.applicationCommands(config.Client.ID), {
        body: commands,
      });

      console.log(
        "[HANDLER] Toutes les slash commands ont bien été chargées.".brightGreen
      );
    } catch (err) {
      console.log(err);
    }
  })();
};
