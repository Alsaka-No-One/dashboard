const RequestHandler = require("../models/RequestHandler");

class Route extends RequestHandler {
    static get(req, res) {
        RequestHandler.render(
            req,
            res,
            req.session.user ? "dashboard" : "index"
        );
    }
}

module.exports = Route;
