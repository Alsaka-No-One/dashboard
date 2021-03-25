const RequestHandler = require.main.require("./models/RequestHandler");
const ServiceStorage = require.main.require("./models/storage/ServiceStorage");

const SERVICES = require.main.require("../config/services.json");

const UNLINKED_SERVICES = Object.fromEntries(
    Object.keys(SERVICES)
        .filter(name => SERVICES[name].is_linkable)
        .map(s => ([s, false]))
)

class Route extends RequestHandler {
    static get(req, res) {
        var {user} = req.session;

        if (!user)
            return RequestHandler.sendError(req, res, 401);
        Route.getLinkedServices(user.id).then(
            result => res.send(result),
            err => res.send(UNLINKED_SERVICES)
        );
    }

    static async getLinkedServices(user_id) {
        var linked = await ServiceStorage.getLinkedServices(user_id);

        return Object.fromEntries(
            Object.entries(SERVICES)
                .filter(([name, service]) => service.is_linkable)
                .map(([name, service]) => [name, linked.includes(name)])
        );
    }
}

module.exports = Route;
