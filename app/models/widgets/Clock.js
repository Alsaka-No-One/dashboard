const axios = require("axios");

class Clock {
    static async load(user_id, {zone, city}) {
        try {
            var result = await axios.get(
                `http://worldtimeapi.org/api/timezone/${encodeURIComponent(zone)}/${encodeURIComponent(city)}`
            );

            return {...result.data, isValid: true};
        } catch (e) {
            if (e.response.status > 500) {
                await new Promise(resolve => {
                    return setTimeout(resolve, 1e3);
                });
                return await Clock.load(user_id, {zone, city});
            }
            return {isValid: false};
        }
    }
}

module.exports = Clock;
