const widget = Vue.component("exchange-exchange-widget", {
    mounted() {
        this.update();
    },
    props: ["id"],
    data() {
        return {
            base:           "",
            symbol:         "",
            amount:         1,
            coef:           1,
            updateTimeout:  null,
            isValid:        true,
            isLoaded:       false
        };
    },
    methods: {
        update() {
            fetch(`/api/widget/${this.id}`)
                .then(data => data.json())
                .then(result => this.setData(result));
        },
        setData(result) {
            this.isLoaded       = true;
            this.isValid        = result.isValid;
            this.base           = result.from;
            this.symbol         = result.to;
            if (!this.isValid)
                return;
            this.updateFreq     = result.update_freq;
            this.coef   = Object.values(result.rates)[0];
            if (this.updateTimeout)
                clearTimeout(this.updateTimeout);
            if (!this.updateFreq)
                return;
            this.updateTimeout = setTimeout(() => {
                this.update()
            }, this.updateFreq * 1e3);
        },
        updateAmount(value) {
            this.amount = Math.min(999999, Math.max(0, this.amount));
        }
    },
    template: `
        <div class="body">
            <div v-if="!isLoaded" class="spinner"></div>
            <div v-if="isValid && coef" class="row">
                <input v-model="amount" @input="updateAmount" type="number" :placeholder="base"> {{base}}
            </div>
            <div v-if="isValid && coef" class="row">
                <i class="fa fa-arrow-down"></i>
            </div>
            <div v-if="isValid && coef" class="row">
                <input :value="(amount * coef).toFixed(2)" :placeholder="symbol" disabled> {{symbol}}
            </div>
            <p v-if="!isValid && base != symbol" class="invalid-message">
                Invalid base ({{base}}) or destination money ({{symbol}})
            </p>
            <p v-if="!isValid && base == symbol" class="invalid-message">
                Cannot convert a currency to itself :/
            </p>
        </div>
    `
});

export default widget;
