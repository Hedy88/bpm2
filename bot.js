// load config from dotenv
require("dotenv").config();

// import Fleet and isMaster from cluster
const { Fleet } = require("eris-fleet");
const { isMaster } = require("cluster");
// import utils from './utils'
const path = require("path");
const logger = require("./utils/logger.js").logger;
// dbl posting
const TopGG = require("@top-gg/sdk");
const dbl = process.env.NODE_ENV === "production" && process.env.DBL !== "" ? new TopGG.Api(process.env.DBL) : null;

// bpm2's logo on startup
if (isMaster) {
    console.log(`
__                    ______ 
|  |--.-----.--------.|__    |
|  _  |  _  |        ||    __|
|_____|   __|__|__|__||______|
      |__|                

bpm2 ${require("./package.json").version}! powered by Eris ${require("./node_modules/eris/package.json").version}
    `);
}

// start new Admiral
const Admiral = new Fleet({
    path          : path.join(__dirname, "./shard.js"),
    token         : `Bot ${process.env.TOKEN}`,
    startingStatus: {
        status: "idle",
        game  : {
            name: "starting up..."
        }
    },
    stats: {
        requestTimeout: 30000
    },
    intents: [
        /* eslint-disable no-undef */
        guilds,
        guild_messages,
        direct_messages
        /* eslint-enable no-undef */
    ],
    services: [
        { name: "wwwService", path: path.join(__dirname, "./utils/services/www/service.js") }
    ]
});

if (isMaster) {
    // tell Admiral to use winston logger
    Admiral.on("log", (m) => logger.main(m));
    Admiral.on("info", (m) => logger.info(m));
    Admiral.on("debug", (m) => logger.debug(m));
    Admiral.on("warn", (m) => logger.warn(m));
    Admiral.on("error", (m) => logger.error(m));

    // start dbl posting
    if (dbl) {
        Admiral.on("stats", async (m) => {
            await dbl.postStats({
                serverCount: m.guilds,
                shardCount : m.shardCount
            });
        });
    }
}