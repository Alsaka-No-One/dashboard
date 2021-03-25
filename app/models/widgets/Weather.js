const axios = require("axios");

class Weather {
    static async load(user_id, {city, update_freq}) {
        try {
            var result = await axios.get(
                "http://api.openweathermap.org/data/2.5/weather", {
                    params: {
                        appid: "ba0cc9efc0708ef27711f0bccca5068a",
                        q: city,
                        units: "metric"
                    }
                }
            );

            return {...result.data, city, update_freq, isValid: true};
        } catch (e) {
            return {city, update_freq, isValid: false};
        }
    }
}

module.exports = Weather;
