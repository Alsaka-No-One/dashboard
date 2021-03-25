const widget = Vue.component("weather-weather-widget", {
    mounted() {
        this.update();
    },
    props: ["id"],
    data() {
        return {
            city:           "",
            temp:           null,
            feelsLike:      null,
            humidity:       null,
            pressure:       null,
            weather:        "",
            icon:           "",
            updateTimeout:  null,
            isValid:        true,
            isLoaded:       false
        };
    },
    methods: {
        update(silent = true) {
            if (!silent)
                this.isLoaded = false;
            fetch(`/api/widget/${this.id}`)
                .then(data => data.json())
                .then(result => this.setData(result));
        },
        setData(result) {
            this.isValid    = result.isValid;
            this.isLoaded   = true;
            this.city       = result.city;
            if (!this.isValid)
                return;
            this.updateFreq = result.update_freq;
            this.temp       = result.main.temp;
            this.feelsLike  = result.main.feels_like;
            this.humidity   = result.main.humidity;
            this.pressure   = result.main.pressure;
            this.weather    = result.weather[0].main;
            this.icon       = `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`;
            if (this.updateTimeout)
                clearTimeout(this.updateTimeout);
            if (!this.updateFreq)
                return;
            this.updateTimeout = setTimeout(() => {
                this.update()
            }, this.updateFreq * 1e3);
        }
    },
    template: `
        <div class="body" v-bind:style="{backgroundImage: this.isLoaded && this.isValid && this.icon ? 'url(' + this.icon + ')' : ''}">
            <div v-if="!this.isLoaded" class="spinner"></div>
            <div v-if="this.isLoaded && this.isValid && this.weather" class="row">
                <h2 class="flex-1">{{this.city}}</h2>
                <p>{{this.temp}} °C</p>
            </div>
            <div v-if="this.isLoaded && this.isValid && this.weather" class="row">
                <h2 class="flex-1">Feels like</h2>
                <p>{{this.feelsLike}} °C</p>
            </div>
            <div v-if="this.isLoaded && this.isValid && this.weather" class="row">
                <h2 class="flex-1">Humidity</h2>
                <p>{{this.humidity}}%</p>
            </div>
            <div v-if="this.isLoaded && this.isValid && this.weather" class="row">
                <h2 class="flex-1">Pressure</h2>
                <p>{{this.pressure}} hPa</p>
            </div>
            <p v-if="this.isLoaded && !this.isValid" class="invalid-message">
                Invalid city name: {{this.city}}
            </p>
        </div>
    `
});

export default widget;
