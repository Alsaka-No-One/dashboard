const path      = require("path");
const express   = require("express");
const session   = require("express-session");
const FileStore = require("session-file-store")(session);

const RequestHandler = require("./RequestHandler");

const secrets = require.main.require("../config/secrets/main.json");

const OPTIONS = {
    port: 80
}

class Server {
    constructor(routes, options) {
        options = Object.assign({...OPTIONS}, options);

        this.port   = options.port;
        this.routes = routes;
        this.app    = express();

        Object.entries(this.routes).forEach(([url, controller_path]) => {
            this.routes[url] = require(
                path.join("../controllers/", controller_path)
            );
        });
        this.app.set("views", "app/views/");
        this.app.set("view engine", "ejs");
        this.app.listen(this.port, () => {
            console.log("Started dashboard server on port", this.port);
        });
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(session({
            store:              new FileStore({retries: 0}),
            secret:             secrets.session,
            resave:             false,
            saveUninitialized:  false
        }));
        this.route();
        this.app.use(express.static(path.resolve("www"), {
            index:      false,
            redirect:   false
        }));
        this.app.use((req, res) => RequestHandler.sendError(req, res, 404));
    }

    route() {
        Object.entries(this.routes).forEach(([route, handler]) => {
            this.app.all(route, (req, res) => {
                (handler[req.method.toLocaleLowerCase()] || handler.all)(req, res);
            });
        });
    }
}

module.exports = Server;
