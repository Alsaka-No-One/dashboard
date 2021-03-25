const widget = Vue.component("widget-params", {
    mounted() {
        if (!this.widget)
            return;
        Object.keys(this.defaults).forEach(key => {
            if (key == "update_freq") {
                this.updateFreq = this.defaults[key];
                return;
            }
            Vue.set(this.data, key, this.defaults[key]);
        });
    },
    props: ["widget", "widgetId", "defaults"],
    data() {
        return {
            isValid:    false,
            updateFreq: 10,
            data:       {}
        }
    },
    methods: {
        updateValidity() {
            this.isValid = this.$refs.form.checkValidity();
            return true;
        },
        onChangeSelect(key, e) {
            this.data[key] = e.srcElement.value;
        },
        onSubmit() {
            return this.$emit("submit", {
                ...this.data,
                update_freq: this.updateFreq
            });
        }
    },
    template: `
        <form @input="updateValidity" @submit.prevent="onSubmit" class="widget-params" ref="form">
            <div class="param" v-if="widget">
                <label v-text="'Update frequency (in sec.)'"></label>
                <input v-model="updateFreq" type="number" required="required" min="10" max="60">
            </div>
            <div v-if="widget" v-for="(param, name) in (widget || {}).params" class="param">
                <label v-text="param.name || (name[0].toLocaleUpperCase() + name.substr(1))"></label>
                <input v-model="data[name]" v-if="widget && param.type == 'string'" type="text" :required="param.required" :minlength="param.minlength || null" :maxlength="param.maxlength || 16">
                <input v-model="data[name]" v-if="widget && param.type == 'number'" type="number" :required="param.required" :min="param.min || null" :max="param.max || null">
                <select @change="onChangeSelect(name, $event)" v-if="widget && param.type == 'enum'" :required="param.required">
                    <option v-if="widget && param.type == 'enum'" disabled selected>Select {{name}}...</option>
                    <option v-if="widget && param.type == 'enum'" v-for="value in param.values" v-text="value"></option>
                </select>
            </div>
            <div class="controls">
                <button type="button" @click="$emit('cancel')">Cancel</button>
                <button class="green" type="submit" :disabled="!isValid">Apply</button>
            </div>
        </form>
    `
});

export default widget;
