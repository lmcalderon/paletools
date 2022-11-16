const fs = require("fs");

const versionData = fs.readFileSync(`${__dirname}/../src/version.js`, { encoding: "utf-8", flag: "r" });
const versionRegex = /(\d+\.\d+\.\d+)/g;
const VERSION = versionRegex.exec(versionData)[1];

module.exports = VERSION;