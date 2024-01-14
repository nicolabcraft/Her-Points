// Check every n minutes if "./gitd.sh" is returning "old" or "new" and
// if it's "new" then end the node process.

var execSync = require("child_process").execSync;

var check = function () {

    const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

    // check if git is installed
    try {
        execSync("git --version");
    } catch (e) {
        console.log("[GIT] Git is not installed.");
        process.exit();
    }
    
    //const branch = process.env. execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

    execSync("git fetch");

    // get local hash
    const localHash = execSync("git rev-parse HEAD").toString().trim();
    // get remote hash
    const remoteHash = execSync("git rev-parse @{u}").toString().trim();

    if (localHash!==remoteHash) {
        console.log("[GIT] App crashed because there is a new version of the bot.");
        process.exit();
    } else {
        const hash = execSync("git rev-parse HEAD").toString().trim();
        console.log(`[GIT] The bot is up to date. (${localHash})`);
    }
};
module.exports = check;

// if this file is executed directly, then execute check()
if (require.main === module) {
    check();
}