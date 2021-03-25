const RequestHandler    = require.main.require("./models/RequestHandler");
const Utils             = require.main.require("./models/Utils");

const WidgetStorage     = require.main.require("./models/storage/WidgetStorage");

class Route extends RequestHandler {
    static async post(req, res) {
        if (!req.session.user)
            return res.status(401).send({error: "Unauthorized"});
        try {
            await Route.orderWidgets(req.session.user.id, req.body.order);
            return res.send({success: true});
        } catch (err) {
            return res.status(400).send({error: err.message});
        }
    }

    static async orderWidgets(user_id, order) {
        if (!order)
            throw Error("order is not set");

        await Promise.all(order.map(
            (id, order) => WidgetStorage.setOrder(id, user_id, order)
        ));
    }
}

module.exports = Route;
