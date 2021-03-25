const Server = require("./models/Server");

const routes = require("../config/routes.json");

class Main {
    static main() {
        new Server(routes, {port: 8080});
    }
}

Main.main();
