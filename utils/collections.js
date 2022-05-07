// export commands and etc...
exports.commands = new Map();
exports.info = new Map();
exports.aliases = new Map();
exports.paths = new Map();

// Cache function
class Cache extends Map {
    // constructor
    constructor(values) {
        super(values);
        this.maxValues = 500;
    }

    // set key/value
    set(key, value) {
        super.set(key, value);
        if (this.size > this.maxValues) this.delete(this.keys().next().value);
    }
}

// export prefixCache
exports.prefixCache = new Cache();