// import collections
const collections = require("./collections.js");
const logger = require("../logger.js").logger;

// load command to memory
exports.load = async (client, ipc, cluster, command) => {
    const props = require(`../${command}`);
    const commandArray = command.split("/");
    const commandName = commandArray[commandArray.length - 1].split(".")[0];
    props.init();

    collections.paths.set(commandName, command);
    collections.commands.set(commandName, props);

    // set command information
    collections.info.set(commandName, {
        category   : commandArray[2],
        description: props.description,
        aliases    : props.aliases,
        params     : props.arguments
    });

    const commandList = await client.getCommands();
    const oldCommand = commandList.filter((item) => {
        return item.name === commandName;
    })[0];
    await client.editCommand(oldCommand.id, {
        name       : commandName,
        type       : 1,
        description: props.description,
        options      : props.flags
    });

    if (props.aliases) {
        for (const alias of props.aliases) {
            collections.aliases.set(alias, commandName);
            collections.paths.set(alias, command);
        }
    }
    return commandName;
};

// unload commands from memory
exports.unload = async (command) => {
    let cmd;
    if (collections.commands.has(command)) {
        cmd = collections.commands.get(command);
    } else if (collections.aliases.has(command)) {
        cmd = collections.commands.get(collections.aliases.get(command));
    }

    if (!cmd) return `Command ${command} not found.`;
    const path = collections.commands.get(command);
    const mod = require.cache[require.resolve(`../${path}`)];
    delete require.cache[require.resolve(`../${path}`)];
    for (let i = 0; i < module.children.length; i++) {
        if (module.children[i] === mod) {
            module.children.splice(i, 1);
            break;
        }
    }
    return false;
};