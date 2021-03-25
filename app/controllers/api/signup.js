const RequestHandler    = require.main.require("./models/RequestHandler");
const Utils             = require.main.require("./models/Utils");
const User              = require.main.require("./models/User");

const UserStorage       = require.main.require("./models/storage/UserStorage");

class Route extends RequestHandler {
    static post(req, res) {
        if (req.session.user)
            return res.redirect("/profile");
        Route.signUp(req.body).then(user => {
            req.session.user = user;
            res.send({success: true});
        }, err => {
            res.status(400).send({error: err.message});
        });
    }

    static async signUp({username, password}) {
        if (!username)
            throw Error("empty username");
        if (!password)
            throw Error("empty password");
        if (username.length < 3)
            throw Error("username too short");
        if (username.length > 16)
            throw Error("username too long");
        if (password.length < 3)
            throw Error("password too short");
        if (password.length > 16)
            throw Error("password too long");
        return User.create(username, password);
    }
}

module.exports = Route;
