// clean error so that it's easier to read
exports.cleanError = (text) => {
    return text.replace(/\n/g, " ").replace(/\s\s+/g, " ").trim();
};