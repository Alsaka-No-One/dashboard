const RequestHandler    = require.main.require("./models/RequestHandler");
const Utils             = require.main.require("./models/Utils");

const WidgetStorage     = require.main.require("./models/storage/WidgetStorage");

class Route extends RequestHandler {
    static async get(req, res) {
        if (!req.session.user)
            return res.status(401).send({error: "Unauthorized"});
        try {
            res.send(await Route.listWidgets(req, res));
        } catch (err) {
            return res.status(400).send({error: err.message});
        }
    }

    static async listWidgets(req, res) {
        var result = await WidgetStorage.list(req.session.user.id);

        return Object.fromEntries(result.map(row => ([
            row.widget_id, {
                service:    row.service,
                type:       row.type,
                order:      +row.order,
                data:       JSON.parse(row.data)
            }
        ])));
    }
}

module.exports = Route;
