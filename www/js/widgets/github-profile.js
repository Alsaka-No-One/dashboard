const widget = Vue.component("github-profile-widget", {
    mounted() {
        this.update();
    },
    props: ["id"],
    data() {
        return {
            username:       "",
            user:           null,
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
            this.isLoaded   = true;
            this.isValid    = !result.error;
            this.error      = result.error;
            this.username   = result.username;
            this.user       = result.user;
            this.updateFreq = result.update_freq;
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
        <div class="body" v-bind:style="{backgroundImage: this.isValid && this.avatar ? 'url(' + this.avatar + ')' : ''}">
            <div v-if="!isLoaded" class="spinner"></div>
            <div v-if="isLoaded && isValid" class="header">
                <a v-if="isLoaded && isValid" class="avatar" v-bind:style="{backgroundImage: 'url(' + user.avatar_url + ')'}" :href="user.html_url" target="_blank"></a>
                <div class="names">
                    <h2 v-if="isLoaded && isValid">{{user.name}}</h2>
                    <h3 v-if="isLoaded && isValid">{{user.login}}</h3>
                    <div v-if="isLoaded && isValid" class="stats">
                        <a :href="user.html_url + '?tab=followers'" target="_blank">
                            <i class="fa fa-user"></i> {{user.followers}}
                        </a>
                        <a :href="user.html_url + '?tab=repositories'" target="_blank">
                            <i class="fa fa-book"></i> {{user.public_repos}}
                        </a>
                    </div>
                </div>
            </div>
            <div v-if="isLoaded && isValid" class="description">
                <p>
                    <i class="fa fa-building"></i> {{user.company}}
                </p>
                <p>
                    <i class="fa fa-map-marker"></i> {{user.location}}
                </p>
            </div>
            <div v-if="isLoaded && !isValid" class="invalid-message">
                {{error}}
            </div>
        </div>
    `
});

export default widget;
