const RequestHandler = require.main.require("./models/RequestHandler");

const SERVICES = require.main.require("../config/services.json");

class Route extends RequestHandler {
    static get(req, res) {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify({
            customer: {
                host: req.connection.remoteAddress.substr(7)
            },
            server: {
                current_time: Math.floor(Date.now() / 1e3),
                services: Object.entries(SERVICES).map(([name, service]) => ({
                    name,
                    widgets: Object.entries(service.widgets).map(([name, widget]) => ({
                        name,
                        description: widget.description,
                        params: Object.entries(widget.params).map(([name, param]) => ({
                            name,
                            ...param
                        }))
                    }))
                }))
            }
        }, null, 2));
    }
}

module.exports = Route;
