new Vue({
    el: "#page",
    mounted() {
        window.addEventListener("scroll", this.onScroll);
    },
    data: {
        progress: 0
    },
    methods: {
        onScroll(e) {
            var scroll = document.documentElement.scrollTop;
            var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

            this.progress = scroll / height;
        }
    }
})
