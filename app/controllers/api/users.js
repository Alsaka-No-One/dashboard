const RequestHandler    = require.main.require("./models/RequestHandler");

const UserStorage       = require.main.require("./models/storage/UserStorage");

class Route extends RequestHandler {
    static get(req, res) {
        if (!req.session.user)
            return res.status(401).send({error: "unauthorized"});
        if (!req.session.user.isAdmin)
            return res.status(403).send({error: "forbidden"});
        UserStorage.list().then(users => {
            return res.send({users: Object.fromEntries(users.map(user => ([
                user.id, {
                    id:         user.id,
                    username:   user.username,
                    is_admin:   user.is_admin,
                    is_banned:  user.is_banned,
                    services:   Object.entries(user)
                        .filter(([key, val]) => val && key.startsWith("has_"))
                        .map(([key, val]) => key.substr(4))
                }
            ])))});
        }, err => {
            res.status(400).send({error: err.message});
        });
    }
}

module.exports = Route;
