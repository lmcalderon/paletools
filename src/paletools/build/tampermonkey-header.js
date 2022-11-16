const VERSION = require("./version");

module.exports = {
    name: "Paletools",
    namespace: "http://pale.tools/fifa/",
    version: VERSION,
    description: "Paletools",
    author: "Paleta",
    match: [
      "https://www.ea.com/*/fifa/ultimate-team/web-app/*",
      "https://www.ea.com/fifa/ultimate-team/web-app/*",
    ],
    grant: ["GM_xmlhttpRequest", "GM_download", "unsafeWindow"],
    connect: [
      "ea.com",
      "ea2.com",
      "futwiz.com",
      "futbin.com"
    ],
    updateURL: "https://pale.tools/fifa/dist/latest/paletools.user.js",
    downloadURL: `https://pale.tools/fifa/dist/latest/paletools.user.js`
};