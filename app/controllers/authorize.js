const RequestHandler    = require.main.require("./models/RequestHandler");
const User              = require.main.require("./models/User");
const ServiceStorage    = require.main.require("./models/storage/ServiceStorage");

const SERVICES = {
    telegram: require.main.require("./models/services/Telegram"),
    discord: require.main.require("./models/services/Discord"),
    gitlab: require.main.require("./models/services/Gitlab"),
    github: require.main.require("./models/services/Github")
}

class Route extends RequestHandler {
    static async get(req, res) {
        var {user}          = req.session;
        var service_name    = req.params.service;
        var service         = SERVICES[service_name];

        if (!service)
            return RequestHandler.sendError(req, res, 404, "Unknown service");
        try {
            var service_data = await service.getServiceUserData(req.query);

            if (user)
                return await Route.linkUser(res, user, service_name, service_data);
            user = await User.authByService(service_name, service_data.service_user_id);
            req.session.user = user;
            req.session.save(_ => {
                res.redirect("/");
            });
        } catch (err) {
            RequestHandler.sendError(
                req,
                res,
                401,
                `Authentication failure: ${err.message}`
            );
        }
    }

    static async linkUser(res, user, service_name, {token, refresh_token, service_user_id}) {
        try {
            await ServiceStorage.link(
                user.id,
                service_name,
                token,
                refresh_token,
                service_user_id
            );
        } catch (err) {
            throw Error(`This ${service_name} profile is already linked`);
        }
        res.redirect("/profile");
    }
}

module.exports = Route;
