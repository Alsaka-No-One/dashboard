const Gitlab = require.main.require("./models/services/Gitlab");

class GitlabRepository {
    static async load(user_id, {repository_id}) {
        try {
            return await GitlabRepository.getRepository(
                user_id,
                repository_id
            );
        } catch (error) {
            return {error: error.message};
        }
    }

    static async getRepository(user_id, repository_id) {
        var gitlab = new Gitlab(user_id);

        await gitlab.load()

        return {
            repository: await gitlab.request(
                `projects/${+repository_id}`
            ),
            files: await gitlab.request(
                `projects/${+repository_id}/repository/tree`
            ),
            isValid: true
        };
    }
}

module.exports = GitlabRepository;
