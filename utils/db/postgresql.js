const collections = require("../collections.js");
const logger = require("../logger.js").logger;

// pSQL pool
const { Pool } = require("pg");
const conn = new Pool({
    connectionString: process.env.DATABASE_URL
});

// get guild information
exports.getGuild = async (query) => {
    return (await conn.query("SELECT * FROM bpm2_guilds WHERE id = $1", [ query ])).rows[0];
};

exports.addGuild = async (guild) => {
    const query = await this.getGuild(guild);
    if (query) return query;
    await conn.query("INSERT INTO bpm2_guilds (id, prefix) VALUES ($1, $2)", [ guild.id, process.env.PREFIX ]);
    return await this.getGuild(guild.id);
};

exports.stop = async () => {
    await conn.end();
};