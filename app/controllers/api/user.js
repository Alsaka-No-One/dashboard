const RequestHandler    = require.main.require("./models/RequestHandler");

const User              = require.main.require("./models/User");

class Route extends RequestHandler {
    static async post(req, res) {
        if (!req.session.user)
            return res.status(401).send({error: "unauthorized"});
        if (!req.session.user.isAdmin)
            return res.status(403).send({error: "forbidden"});
        try {
            var user = await User.get(req.params.id);

            if (!user)
                throw Error("no such user");
            if (req.body.is_admin !== undefined)
                return res.send({success: await user.setAdmin(!!req.body.is_admin)});
            if (req.body.is_banned !== undefined)
                return res.send({success: await user.setBanned(!!req.body.is_banned)});
            throw Error("no valid field provided");
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    }

    static async delete(req, res) {
        if (!req.session.user)
            return res.status(401).send({error: "unauthorized"});

        var user_id = req.params.id || req.session.user.id;

        if (!req.session.user.isAdmin && user_id != req.session.user.id)
            return res.status(403).send({error: "forbidden"});
        try {
            var user = await User.get(user_id);

            if (!user)
                throw Error("no such user");
            await user.delete();
            return res.send({success: true});
        } catch (err) {
            res.status(400).send({error: err.message});
        }
    }
}

module.exports = Route;
