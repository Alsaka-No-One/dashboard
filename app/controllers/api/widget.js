const RequestHandler    = require.main.require("./models/RequestHandler");
const Utils             = require.main.require("./models/Utils");

const WidgetStorage     = require.main.require("./models/storage/WidgetStorage");

const WIDGETS = {
    gitlab: {
        repository: require.main.require("./models/widgets/GitlabRepository"),
        profile: require.main.require("./models/widgets/GitlabProfile")
    },
    github: {
        repository: require.main.require("./models/widgets/GithubRepository"),
        profile: require.main.require("./models/widgets/GithubProfile"),
    },
    weather: {
        weather: require.main.require("./models/widgets/Weather")
    },
    exchange: {
        exchange: require.main.require("./models/widgets/Exchange")
    },
    time: {
        clock: require.main.require("./models/widgets/Clock")
    }
}

class Route extends RequestHandler {
    static async get(req, res) {
        if (!req.session.user)
            return res.status(401).send({error: "Unauthorized"});
        try {
            res.send(await Route.getWidget(
                req.session.user.id,
                req.params.widget_id
            ));
        } catch (err) {
            return res.status(400).send({error: err.message});
        }
    }

    static async post(req, res) {
        if (!req.session.user)
            return res.status(401).send({error: "Unauthorized"});
        try {
            res.send(await Route.createWidget(req, res));
        } catch (err) {
            return res.status(400).send({error: err.message});
        }
    }

    static async patch(req, res) {
        if (!req.session.user)
            return res.status(401).send({error: "Unauthorized"});
        try {
            res.send(await Route.updateWidget(
                req.session.user.id,
                req.params.widget_id,
                req.body
            ));
        } catch (err) {
            return res.status(400).send({error: err.message});
        }
    }

    static async delete(req, res) {
        if (!req.session.user)
            return res.status(401).send({error: "Unauthorized"});
        try {
            res.send(await Route.deleteWidget(
                req.session.user.id,
                req.params.widget_id
            ));
        } catch (err) {
            return res.status(400).send({error: err.message});
        }
    }

    static async getWidget(user_id, widget_id) {
        var widget  = await WidgetStorage.get(user_id, widget_id);
        var data    = JSON.parse(widget.data)

        if (!widget)
            throw Error("no such widget");
        return {...(await WIDGETS[widget.service][widget.type].load(
            user_id,
            data
        )), ...data};
    }

    static async updateWidget(user_id, widget_id, data) {
        return {success: await WidgetStorage.setData(widget_id, user_id, data)};
    }

    static async createWidget(req, res) {
        var {service, type, order, data} = req.body;

        console.log("body:", req.body);
        if (!service === undefined)
            throw Error("no service specified");
        if (!type === undefined)
            throw Error("no type specified");
        if (order === undefined)
            throw Error("no order specified");
        if (isNaN(order))
            throw Error("invalid order");
        return {id: await WidgetStorage.create(
            req.session.user.id, service, type, order, data
        )};
    }

    static async deleteWidget(user_id, widget_id) {
        var success = await WidgetStorage.delete(user_id, widget_id);

        return {success};
    }
}

module.exports = Route;
