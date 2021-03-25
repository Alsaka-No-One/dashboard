new Vue({
    el: "#app",
    mounted() {
        window.addEventListener("scroll", this.onScroll);
    },
    data: {
        progress: 0,
        isFlipped: is_flipped
    },
    methods: {
        hideError() {
            document.getElementById("alert").classList.remove("shown");
        },
        flipCard() {
            this.isFlipped = !this.isFlipped;
            window.history.replaceState(
                null, null, "sign" + (this.isFlipped ? "up" : "in")
            );
        },
        auth(e) {
            var process_response = async res => {
                var json = await res.json();

                if (!json.error)
                    return window.location.href = "/";

                var alert = document.getElementById("alert");

                alert.innerText = "Error: " + json.error;
                alert.classList.add("shown");
            };

            this.hideError();
            fetch(e.target.action, {
                method: "post",
                body: JSON.stringify(
                    Object.fromEntries(new FormData(e.target).entries())
                ),
                headers: {"Content-type": "application/json; charset=UTF-8"}
            }).then(process_response, process_response);
        },
        authTelegram() {
            Telegram.Login.auth({bot_id: 1358242895, request_access: true}, data => {
                if (data)
                    window.location.href = "authorize/telegram?" + Object.entries(data).map(e => e.map(encodeURIComponent).join("=")).join("&");
            });
        },
        authDiscord() {
            window.location.href = "https://discord.com/api/oauth2/authorize?client_id=776815022306623488&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fauthorize%2Fdiscord&response_type=code&scope=email%20identify";
        },
        authGithub() {
            window.location.href = "https://github.com/login/oauth/authorize?scope=user:email&client_id=21c04904e038c922603b";
        },
        authGitlab() {
            window.location.href = "https://gitlab.com/oauth/authorize?client_id=f220d64f6726338afd9984a01f53dce7347c5f434d3e1e842fa2d25e6345a247&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fauthorize%2Fgitlab&response_type=code&scope=read_user%20read_api%20read_repository%20email";
        }
    }
})
