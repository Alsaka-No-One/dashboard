const Storage = require("./Storage");

class ServiceStorage extends Storage {
    constructor() {
        super();
    }

    async link(user_id, sevice_name, token, refresh_token, service_user_id) {
        var result = await this.query(
            `INSERT
                INTO services (user_id, service, token, refresh_token, service_user_id)
                VALUES (?, ?, ?, ?, ?);`,
            user_id, sevice_name, token, refresh_token, service_user_id
        )

        return !!result.affectedRows;
    }

    async getLinkedServices(user_id) {
        return (await this.query(
            `SELECT service FROM services WHERE user_id = ?;`,
            user_id
        )).map(row => row.service);
    }

    async getServiceTokens(user_id, service) {
        return {...(await this.query(
            `SELECT
                token, refresh_token, service_user_id
                FROM services
                WHERE user_id = ? AND service = ?;`,
            user_id, service
        ))[0]};
    }

    async unlinkService(user_id, service) {
        var result = await this.query(
            `DELETE FROM services
                WHERE user_id = ? AND service = ?;`,
            user_id, service
        );

        return !!result.affectedRows;
    }
}

module.exports = new ServiceStorage();
