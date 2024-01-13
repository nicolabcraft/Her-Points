// Check every n minutes if "./gitd.sh" is returning "old" or "new" and
// if it's "new" then end the node process.

var execSync = require("child_process").execSync;

var check = function (fallback=()=>{}) {

    // check if git is installed
    try {
        execSync("git --version");
    } catch (e) {
        console.log("[GIT] Git is not installed.");
        process.exit();
        return;
    }
    
    //const branch = process.env. execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

    execSync("git fetch");

    const stdout = execSync(`git status --porcelain`).toString().trim();

    if (stdout.length > 0) {
        console.log("[GIT] App crashed because there is a new version of the bot.");
        process.exit();
    } else {
        const hash = execSync("git rev-parse HEAD").toString().trim();
        console.log(`[GIT] The bot is up to date. (${hash})`);
        fallback();
    }
};
module.exports = check;

// if this file is executed directly, then execute check()
if (require.main === module) {
    check();
}