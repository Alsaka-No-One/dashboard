const RequestHandler = require("../models/RequestHandler");

class Route extends RequestHandler {
    static get(req, res) {
        if (req.session.user)
            return res.redirect("/profile");
        RequestHandler.render(req, res, "auth", {is_sign_up: false});
    }
}

module.exports = Route;
