const widget = Vue.component("gitlab-repository-widget", {
    mounted() {
        this.update();
    },
    props: ["id"],
    data() {
        return {
            url:            "",
            updateFreq:     null,
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
            this.isLoaded       = true;
            this.isValid        = !result.error;
            this.error          = result.error;
            this.repositoryId   = result.repository_id;
            this.files          = result.files;
            this.repository     = result.repository;
            this.updateFreq     = result.update_freq;
            if (!this.isValid)
                return;
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
        <div class="body">
            <div v-if="!isLoaded" class="spinner"></div>
            <div v-if="isLoaded && isValid" class="header">
                <h2 class="name">
                    <a v-if="isLoaded" :href="repository.web_url" target="_blank">{{repository.name}}</a>
                </h2>
                <i v-if="isLoaded" v-bind:class="{fa: 1, 'fa-lock': repository.visibility == 'private', 'fa-globe': repository.visibility == 'public'}"></i>
                <a class="namespace" v-bind:style="{backgroundImage: 'url(http://gitlab.com' + repository.namespace.avatar_url + ')'}" :href="repository.namespace.web_url" target="_blank"></a>
                <div v-if="isLoaded && isValid" class="namespace-popup">
                    <p v-if="isLoaded" class="name">{{repository.namespace.name}}</p>
                    <p v-if="isLoaded" class="path">@{{repository.namespace.path}}</p>
                </div>
            </div>
            <p v-if="isLoaded && isValid" class="date">{{new Date(repository.created_at).toLocaleString().substr(0, 10)}} {{new Date("2020-11-22T23:31:05.039Z").toISOString().substr(11, 8)}}</p>
            <div v-if="isLoaded && isValid" class="title">
                <p>ID</p>
                <p>Name</p>
            </div>
            <div v-if="isLoaded && isValid" class="files">
                <div v-for="file in files" class="file">
                    <p class="file-name">{{file.id.substr(0, 8)}}</p>
                    <p><a v-if="isLoaded && isValid" :href="repository.web_url + '/-/blob/' + repository.default_branch + '/' + file.path" target="_blank">{{file.name}}</a></p>
                </div>
            </div>
            <div v-if="isLoaded && !isValid" class="invalid-message">
                {{error}}
            </div>
        </div>
    `
});

export default widget;
