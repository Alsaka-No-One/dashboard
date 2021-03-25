const crypto = require("crypto");

const config = require.main.require("../config/secrets/telegram.json");

const SIGN_KEY = crypto.createHash("sha256").update(config.token).digest();

class Telegram {
    static async getServiceUserData(data) {
        var {hash, ...data} = data;
        var str = Object.entries(data)
            .sort()
            .map(([key, val]) => `${key}=${val}`)
            .join("\n");
        var hmac = crypto.createHmac("sha256", SIGN_KEY)
            .update(str)
            .digest("hex");

        if (hmac != hash)
            throw Error("data compromised");
        if (
            !+data.auth_date
            || (+data.auth_date) + config.auth_timeout < Date.now() / 1e3
        )
            throw Error("outdated data. Please retry.");
        return {service_user_id: data.id, token: null};
    }
}

module.exports = Telegram;
