const Gitlab = require.main.require("./models/services/Gitlab");

class GitlabProfile {
    static async load(user_id, {username}) {
        try {
            return await GitlabProfile.getRepository(
                user_id,
                username
            );
        } catch (error) {
            return {error: error.message};
        }
    }

    static async getRepository(user_id, username) {
        var gitlab = new Gitlab(user_id);

        await gitlab.load();

        var user = (await gitlab.request(
            `users?username=${encodeURIComponent(username)}`
        ))[0];

        if (!user)
            throw Error(`User ${username} not found`);
        return {
            user,
            projects: await gitlab.request(`users/${+user.id}/projects`),
            isValid: true
        };
    }
}

module.exports = GitlabProfile;
