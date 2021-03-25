const RequestHandler = require("../models/RequestHandler");

class Route extends RequestHandler {
    static async get(req, res) {
        var {user} = req.session;

        if (!user)
            return RequestHandler.sendError(req, res, 401);
        RequestHandler.render(req, res, "profile");
    }
}

module.exports = Route;
