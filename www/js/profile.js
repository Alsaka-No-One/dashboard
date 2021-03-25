const DELETE_MSG = "Hey, listen!\n\n" +
    "You're about to permanently delete your account.\n" +
    "This will also delete all your widgets and unlink all services.\n" +
    "This action is permanent and cannot be undone.\n\n" +
    "Are you sure you want to proceed with deletion?";

new Vue({
    el: "#app",
    data: {
        services: {}
    },
    mounted() {
        fetch("/api/linked_services")
            .then(data => data.json())
            .then(json => { this.services = json; });
    },
    methods: {
        onClickService(name) {
            const HANDLERS = {
                "telegram": this.onClickTelegram,
                "discord":  this.onClickDiscord,
                "github":   this.onClickGithub,
                "gitlab":   this.onClickGitlab
            };
            const handler = HANDLERS[name];

            if (this.services[name] || !handler)
                return this.unlinkService(name);
            return handler();
        },
        onClickTelegram() {
            Telegram.Login.auth({bot_id: 1358242895, request_access: true}, data => {
                if (data)
                    window.location.href = "authorize/telegram?" + Object.entries(data).map(e => e.map(encodeURIComponent).join("=")).join("&");
            });
        },
        onClickDiscord() {
            window.location.href = "https://discord.com/api/oauth2/authorize?client_id=776815022306623488&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fauthorize%2Fdiscord&response_type=code&scope=identify%20email%20messages.read";
        },
        onClickGitlab() {
            window.location.href = "https://gitlab.com/oauth/authorize?client_id=f220d64f6726338afd9984a01f53dce7347c5f434d3e1e842fa2d25e6345a247&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fauthorize%2Fgitlab&response_type=code&scope=read_user+read_api+read_repository+profile+email";
        },
        onClickGithub() {
            window.location.href = "https://github.com/login/oauth/authorize?scope=read:user%20repo&client_id=21c04904e038c922603b";
        },
        unlinkService(service_name) {
            fetch("api/unlink/" + service_name, {
                method: "POST"
            }).then(result => result.json()).then(json => {
                if (json.success)
                    this.services[service_name] = false;
            });
        },
        onClickDelete() {
            if (!confirm(DELETE_MSG))
                return;
            fetch("api/user", {
                method: "DELETE"
            }).then(_ => { window.location.href = "/signout"; });
        }
    }
})
