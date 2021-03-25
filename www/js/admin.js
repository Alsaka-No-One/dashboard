new Vue({
    el: "#app",
    mounted() {
        window.addEventListener("scroll", this.onScroll);
        this.fetchUsers();
    },
    data: {
        progress: 0,
        users: [],
    },
    methods: {
        async fetchUsers() {
            var {users} = await (await fetch("/api/users")).json();

            this.users = users;
        },
        async toggleAdmin(user) {
            var {success} = await (await fetch(`/api/user/${user.id}`, {
                method:     "POST",
                body:       JSON.stringify({is_admin: !user.is_admin}),
                headers:    {"Content-type": "application/json; charset=UTF-8"}
            })).json();
            if (success)
                user.is_admin = !user.is_admin;
        },
        async toggleBanned(user) {
            var {success} = await (await fetch(`/api/user/${user.id}`, {
                method:     "POST",
                body:       JSON.stringify({is_banned: !user.is_banned}),
                headers:    {"Content-type": "application/json; charset=UTF-8"}
            })).json();
            if (success)
                user.is_banned = !user.is_banned;
        },
        async deleteUser(user) {
            if (!confirm(
                `You're about to delete user #${user.id} (${user.username})\n` +
                `This action will also delete all their widgets and services.\n` +
                `This can't be undone.\n\n` +
                `Confirm deletion?`
            ))
                return;
            var {success} = await (await fetch(`/api/user/${user.id}`, {
                method:     "DELETE"
            })).json();
            if (success)
                Vue.set(user, "isDeleted", true);
        }
    }
})
