const Github = require.main.require("./models/services/Github");

class GithubProfile {
    static async load(user_id, {username}) {
        try {
            return await GithubProfile.getRepository(
                user_id,
                username
            );
        } catch (error) {
            return {error: error.message};
        }
    }

    static async getRepository(user_id, username) {
        var github = new Github(user_id);

        await github.load();

        return {
            user: await github.request(`users/${encodeURIComponent(username)}`),
            isValid: true
        };
    }
}

module.exports = GithubProfile;
