// import { BaseServiceWorker } from eris-fleet
const { BaseServiceWorker } = require("eris-fleet");
const { readdir } = require("fs");
// import utils
const path = require("path");
const logger = require("./utils/logger.js").logger;
const misc = require("./utils/misc.js");
const { messages } = require("./messages.json");
const collections = require("./utils/collections.js");
// db
const db = require("./utils/db.js");
// import command handler
const commandHandler = require("./utils/commandHandler.js");

// make a new Shard class
class Shard extends BaseServiceWorker {
    // constructor
    constructor(bot) {
        super(bot);

        this.init();
    }

    // init
    async init() {
        // register commands
        logger.info("Registering commands...");
        for await (const commandFile of this.getFiles("./commands")) {
            // register command
            logger.info("Registering command: " + commandFile);
            try {
                await commandHandler.load(commandFile);
            } catch (e) {
                logger.error("Failed to register command: " + commandFile);
            }
        }

        // register events
        logger.info("Registering events...");
        const events = await readdir("./events");
        for (const eventFile of events) {
            // register event
            logger.info("Registering event: " + eventFile);
            // get eventname
            const eventName = eventFile.split(".")[0];
            // get event
            const event = require(path.join("./events", eventFile));
            // register event
            this.bot.on(eventName, event.bind(null, this.bot, this.clusterID, this.workerID, this.ipc));
        }

        // call activityChanger
        this.activityChanger();

        // log ready
        logger.info(`Started worker: ${this.workerID}.`);
    }

    // set activity state
    activityChanger() {
        // set activity
        this.bot.setStatus("dnd", {
            name: `${misc.random(messages)} | ${this.bot.user.username} help`
        });
        // setTimeout
        setTimeout(this.activityChanger.bind(this), 12000);
    }

    // get files
    async* getFiles(dir) {
        // get files
        const directs = readdir(dir, { withFileTypes: true });
        // loop through files
        for (const direct of directs) {
            // if file is directory
            if (direct.isDirectory()) {
                // get files
                yield this.getFiles(path.join(dir, direct.name));
            } else {
                // yield file
                yield path.join(dir, direct.name);
            }
        }
    }

    // bot shutdown sequence
    shutdown(done) {
        // log shutdown
        logger.info("Shutting down...");
        // edit status
        this.bot.setStatus("dnd", {
            name: "restarting / shutting down..."
        });
        // unload commands
        for (const command of collections.commands) {
            commandHandler.unload(command);
        }
        // stop db conn
        db.stop();
        // shutdown bot
        done();
    }
}

// export Shard
module.exports = Shard;