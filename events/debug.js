const logger = require("../utils/logger.js").logger;

module.exports = async (client, cluster, worker, ipc, message) => {
    logger.debug(message);
};