const RequestHandler = require.main.require("./models/RequestHandler");

const SERVICES = require.main.require("../config/services.json");

class Route extends RequestHandler {
    static get(req, res) {
        res.setHeader("content-type", "application/json");
        res.send(SERVICES);
    }
}

module.exports = Route;
