// import BaseServiceWorker from eris-fleet
const { BaseServiceWorker } = require("eris-fleet");
// import Express and EJS + utils from "./utils"
const express = require("express");
const app = express();
const path = require("path");
const logger = require("../../logger.js").logger;

// wwwService class
class wwwService extends BaseServiceWorker {
    // constructor
    constructor(setup) {
        super(setup);

        // start wwwService
        this.www().then(() => this.serviceReady());
    }

    async www() {
        // set EJS as template engine
        app.set("view engine", "ejs");

        // set views path
        app.set("views", path.join(__dirname, "./views"));

        // set routes
        app.get("/", (req, res) => {
            // render index.EJS
            res.render("index.ejs");
        });

        // listen on port in env or 3000
        app.listen(process.env.PORT, () => {
            logger.info(`wwwService: started on port ${process.env.PORT}`);
        });
    }

    // shutdown sequence
    shutdown(done) {
        // log shutdown
        logger.info("wwwService: shutting down service...");
        // close server
        app.close();
        // shutdown service
        done();
    }
}