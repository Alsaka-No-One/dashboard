const axios     = require("axios");

const Utils     = require.main.require("./models/Utils");

const config    = require.main.require("../config/secrets/discord.json");

class Discord {
    static async getServiceUserData({code}) {
        var {data: auth} = await axios.post(
            "https://discord.com/api/oauth2/token",
            Utils.querify({
                client_id: config.client_id,
                client_secret: config.secret,
                grant_type: "authorization_code",
                code,
                redirect_uri: config.redirect_uri,
                scope: config.scopes.join(" "),
            })
        );

        var {data} = await axios.create({
            baseURL: "https://discord.com/api/v6/",
            headers: {Authorization: `Bearer ${auth.access_token}`}
        }).get("users/@me");

        return {
            service_user_id: +data.id,
            token: auth.access_token,
            refresh_token: auth.refresh_token
        };
    }
}

module.exports = Discord;
