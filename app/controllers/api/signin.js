const RequestHandler    = require.main.require("./models/RequestHandler");
const Utils             = require.main.require("./models/Utils");
const User              = require.main.require("./models/User");

const UserStorage       = require.main.require("./models/storage/UserStorage");

class Route extends RequestHandler {
    static post(req, res) {
        if (req.session.user)
            return res.redirect("/profile");
        Route.signIn(req.body).then(user => {
            req.session.user = user;
            req.session.save(err => {
                res.send({success: !!err});
            });
        }, err => {
            res.status(400).send({error: err.message});
        });
    }

    static async signIn({username, password}) {
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
        return User.authenticate(username, password);
    }
}

module.exports = Route;
