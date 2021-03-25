const axios             = require("axios");

const Utils             = require.main.require("./models/Utils");
const ServiceStorage    = require.main.require("./models/storage/ServiceStorage");

const config    = require.main.require("../config/secrets/github.json");

class Github {
    constructor(user_id) {
        this.userId = user_id;
        this.token  = null;
    }

    async load() {
        var {token, refresh_token} = await ServiceStorage.getServiceTokens(
            this.userId,
            "github"
        );

        this.token          = token;
        this.refresh_token  = refresh_token;
    }

    request(endpoint, method = "GET", data = {}) {
        return axios({
            url: "https://api.github.com/" + endpoint,
            headers: {Authorization: `Bearer ${this.token}`},
            method,
            data
        }).then(result => result.data)
            .catch(err => {
                throw Error(err.response.status == 404
                    ? "Not found"
                    : "Service not linked"
                );
            });
    }

    static async getServiceUserData({code}) {
        var {data: auth} = await axios.post(
            "https://github.com/login/oauth/access_token",
            Utils.querify({
                client_id:      config.client_id,
                client_secret:  config.secret,
                redirect_uri:   config.redirect_uri,
                code
            })
        );

        auth = Utils.unquerify(auth);

        var {data} = await axios.create({
            baseURL: "https://api.github.com/",
            headers: {Authorization: `token ${auth.access_token}`}
        }).get("user");

        return {
            service_user_id: +data.id,
            token: auth.access_token,
            refresh_token: auth.refresh_token
        };
    }
}

module.exports = Github;
