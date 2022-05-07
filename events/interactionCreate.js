// import utils
const { promises } = require("fs");
const logger = require("../utils/logger.js").logger;
const collections = require("../utils/collections.js");
const { CommandInteraction } = require("eris");
const misc = require("../utils/misc.js");

// run when a slash cmd is executed
module.exports = async (client, cluster, worker, ipc, interaction) => {
    // check if interaction is an instance of CommandInteraction
    if (!(interaction instanceof CommandInteraction)) return;

    // check if command exists
    const command = interaction.data.name;
    const cmd = collections.commands.get(command);
    if (!cmd) return;

    // set invoker
    const invoker = interaction.member ?? interaction.user;

    // actually run the command
    logger.info(`${invoker.username} (${invoker.id}) ran command: ${interaction.command}`);
    try {
        const commandClass = new cmd(client, cluster, worker, ipc, { type: "application", interaction });
        const result = await commandClass.run();
    } catch (error) {
        logger.error(`${invoker.username} (${invoker.id}) ran command: ${interaction.command} and failed.`);
        // edit original message and give an error  message
        try {
            await interaction[interaction.acknowledge ? "editOrginalMessage" : "createMessage"](`sorry, the server sent an error while running your command. please report the content in this error file to <https://github.com/Hedy88/bpm2/issues>`, {
                file: `error: ${await misc.cleanError(error)}.\n\nstack trace: ${await misc.cleanError(error.stack)}`,
                name: "error.txt"
            });
        } catch {
            // do nothing
        }
    }
};