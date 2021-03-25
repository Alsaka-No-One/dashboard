const widget = Vue.component("time-clock-widget", {
    mounted() {
        this.update();
    },
    props: ["id"],
    data() {
        return {
            zone:           "",
            city:           "",
            type:           null,
            initTime:       new Date(),
            time:           new Date(),
            perfOffset:     null,
            tickTimeout:    null,
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
        tick() {
            this.time = new Date(Date.now() + this.timeOffset);
            clearTimeout(this.tickTimeout);
            this.tickTimeout = setTimeout(() => {
                this.tick();
            }, 1e3);
        },
        setData(result) {
            this.isValid    = !!result.isValid;
            this.zone       = result.zone;
            this.city       = result.city;
            this.type       = result.type;
            this.timeOffset = result.raw_offset * 1e3 + new Date().getTimezoneOffset() * 60e3;
            this.time       = new Date(Date.now() + this.timeOffset);
            this.initTime   = this.time;
            this.isLoaded   = true;
            if (!this.isValid)
                return;
            clearTimeout(this.tickTimeout);
            this.tickTimeout = setTimeout(() => {
                this.tick();
            }, Date.now() % 1e3);
        }
    },
    template: `
        <div class="body" v-bind:style="{backgroundImage: this.isValid && this.icon ? 'url(' + this.icon + ')' : ''}">
            <div v-if="!this.isLoaded" class="spinner"></div>
            <div v-show="this.isLoaded && this.isValid && this.type == 'analog'" class="analog">
                <div v-bind:style="{transform: 'rotate(' + this.initTime.getHours() % 12 / 12 * 360 + 'deg)'}" class="h"><div></div></div>
                <div v-bind:style="{transform: 'rotate(' + this.initTime.getMinutes() / 60 * 360 + 'deg)'}" class="m"><div></div></div>
                <div v-bind:style="{transform: 'rotate(' + this.initTime.getSeconds() / 60 * 360 + 'deg)'}" class="s"><div ref="seconds"></div></div>
            </div>
            <h2 v-if="this.isLoaded && this.isValid && this.type == 'digital'" class="digital">
                {{("" + this.time.getHours()).padStart(2, 0)}}:{{("" + this.time.getMinutes()).padStart(2, 0)}}:{{("" + this.time.getSeconds()).padStart(2, 0)}}
            </h2>
            <p v-if="this.isLoaded && this.isValid && this.zone">
                {{this.zone}}/{{this.city}}
            </p>
            <p class="invalid-message" v-if="this.isLoaded && !this.isValid">
                Invalid timezone: {{this.zone}}/{{this.city}}
            </p>
        </div>
    `
});

export default widget;
