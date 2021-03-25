const axios = require("axios");

class ExchanteRate {
    static async load(user_id, {from, to, update_freq}) {
        try {
            var result = await axios.get(
                "https://api.exchangeratesapi.io/latest", {
                    params: {
                        base: from,
                        symbols: to
                    }
                }
            );

            return {...result.data, from, to, update_freq, isValid: true};
        } catch (e) {
            return {from, to, update_freq, isValid: false};
        }
    }
}

module.exports = ExchanteRate;
