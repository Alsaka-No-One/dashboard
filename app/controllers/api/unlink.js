const RequestHandler = require.main.require("./models/RequestHandler");
const ServiceStorage = require.main.require("./models/storage/ServiceStorage");

const services = require.main.require("../config/services.json");

class Route extends RequestHandler {
    static post(req, res) {
        var {user}          = req.session;
        var service_name    = req.params.service;

        if (!user)
            return RequestHandler.sendError(req, res, 401);
        if (!services[service_name])
            return RequestHandler.sendError(req, res, 404, "Unknown service");
        return ServiceStorage.unlinkService(user.id, req.params.service)
            .then(() => {
                res.send({success: true});
            }, err => {
                RequestHandler.sendError(req, res, 400, "Service not linked");
            });
    }
}

module.exports = Route;
