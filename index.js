const config = require("./config/config");

// - Git auto update - start

const gitCheckActive = config?.GitAutoUpdate?.enable;
if (gitCheckActive) {
    console.log("[INFO] Git auto update is enabled.");
    const gitCheck = require("./check-git.js");
    gitCheck(() => {
        require("./bot.js");
    });
    setInterval(gitCheck, (config.GitAutoUpdate?.interval || 5) * 60000);
} else {
    console.log("[INFO] Git auto update is disabled.");
    require("./bot.js");
}
