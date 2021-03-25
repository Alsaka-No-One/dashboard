const RequestHandler = require("../models/RequestHandler");

class Route extends RequestHandler {
    static async get(req, res) {
        var {user} = req.session;

        if (!user)
            return RequestHandler.sendError(req, res, 401);
        if (!user.isAdmin)
            return RequestHandler.sendError(req, res, 403);
        RequestHandler.render(req, res, "admin");
    }
}

module.exports = Route;
