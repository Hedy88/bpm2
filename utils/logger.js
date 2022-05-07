const winston = require("winston");

const logger = winston.createLogger({
    levels: {
        error: 0,
        warn : 1,
        debug: 2,
        info : 3,
        main : 4
    },
    transports: [
        new winston.transports.Console({ format: winston.format.colorize({ all: true }), stderrLevels: [ "error", "warn" ] }),
        new winston.transports.File({ filename: "../logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "../logs/main.log" })
    ],
    format: winston.format.combine(
        winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        winston.format.printf((info) => {
            const {
                timestamp, level, message, ...args
            } = info;

            return `[${timestamp}]: [${level.toUpperCase()}] - ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ""}`;
        })
    )
});

winston.addColors({
    info : "green",
    main : "gray",
    warn : "yellow",
    debug: "magenta",
    error: "red"
});

exports.logger = logger;