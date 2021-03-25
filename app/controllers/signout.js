const RequestHandler = require("../models/RequestHandler");

class Route extends RequestHandler {
    static get(req, res) {
        req.session.destroy();
        res.redirect("/");
    }
}

module.exports = Route;
