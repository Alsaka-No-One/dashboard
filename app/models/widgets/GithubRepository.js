const Github = require.main.require("./models/services/Github");

class GithubRepository {
    static async load(user_id, {namespace, name}) {
        try {
            return await GithubRepository.getRepository(
                user_id,
                namespace,
                name
            );
        } catch (error) {
            return {error: error.message};
        }
    }

    static async getRepository(user_id, namespace, name) {
        var github = new Github(user_id);
        var base_url = `repos/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`

        await github.load();

        return {
            repository: await github.request(base_url),
            files: await github.request(base_url + "/contents"),
            isValid: true
        };
    }
}

module.exports = GithubRepository;
