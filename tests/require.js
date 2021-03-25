var path = require("path");

require.main.require = function(name) {
    return require(path.join(__dirname, "../app", name));
}
