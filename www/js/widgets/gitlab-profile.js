const widget = Vue.component("gitlab-profile-widget", {
    mounted() {
        this.update();
    },
    props: ["id"],
    data() {
        return {
            username:       "",
            projects:       null,
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
            this.projects   = result.projects;
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
                <a v-if="isLoaded && isValid" class="avatar" v-bind:style="{backgroundImage: 'url(' + user.avatar_url + ')'}" :href="user.web_url" target="_blank"></a>
                <div class="names">
                    <h2 v-if="isLoaded && isValid">{{user.name}}</h2>
                    <h3 v-if="isLoaded && isValid" class="username">@{{user.username}}</h3>
                </div>
            </div>
            <div v-if="isLoaded && isValid" class="title">
                <p>Project</p>
                <p>Description</p>
            </div>
            <div v-if="isLoaded && isValid" class="projects">
                <div v-for="project in projects" class="project">
                    <p><a v-if="isLoaded && isValid" class="project-name" :href="project.web_url" target="_blank">{{project.name}}</a></p>
                    <p>{{project.description}}</p>
                </div>
            </div>
            <div v-if="isLoaded && !isValid" class="invalid-message">
                {{error}}
            </div>
        </div>
    `
});

export default widget;
