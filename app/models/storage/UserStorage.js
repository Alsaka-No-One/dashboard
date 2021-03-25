const Storage = require("./Storage");

class UserStorage extends Storage {
    constructor() {
        super();
    }

    create(username, password) {
        return this.query(
            `INSERT
                INTO users (username, password)
                SELECT ?, ?
                WHERE NOT EXISTS(SELECT * FROM users WHERE username = ?);`,
            username,
            password,
            username
        ).then(result => result.insertId);
    }

    async getById(id) {
        var user = (await this.query(
            `SELECT * FROM users WHERE id = ?;`,
            id
        ))[0];

        return user
            ? {
                ...user,
                is_admin: !!user.is_admin[0],
                is_banned: !!user.is_banned[0]
            }
            : null;
    }

    async getByUsername(username) {
        var user = (await this.query(
            `SELECT * FROM users WHERE username = ?;`,
            username
        ))[0];

        return user
            ? {
                ...user,
                is_admin: !!user.is_admin[0],
                is_banned: !!user.is_banned[0]
            }
            : null;
    }

    async getByServiceId(service, service_user_id) {
        var user = (await this.query(
            `SELECT users.*
                FROM users
                LEFT JOIN services ON user_id = id
                WHERE service = ?
                    AND service_user_id = ?;`,
            service, service_user_id
        ))[0];

        return user
            ? {
                ...user,
                is_admin: !!user.is_admin[0],
                is_banned: !!user.is_banned[0]
            }
            : null;
    }

    async list(limit = 32) {
        var users = await this.query(
            `SELECT
            	*,
                EXISTS(SELECT user_id from services WHERE user_id = id AND service = "telegram") AS has_telegram,
                EXISTS(SELECT user_id from services WHERE user_id = id AND service = "discord") AS has_discord,
                EXISTS(SELECT user_id from services WHERE user_id = id AND service = "gitlab") AS has_gitlab,
                EXISTS(SELECT user_id from services WHERE user_id = id AND service = "github") AS has_github
            		FROM dashboard.users;`,
            limit
        );

        return users.map(user => ({
            ...user,
            is_admin: !!user.is_admin[0],
            is_banned: !!user.is_banned[0]
        }));
    }

    async setAdmin(id, val) {
        var result = await this.query(
            `UPDATE users
                SET is_admin = ?
                WHERE (id = ?);`,
            val, id
        );

        return !!result.affectedRows;
    }

    async setBanned(id, val) {
        var result = await this.query(
            `UPDATE users
                SET is_banned = ?
                WHERE (id = ?);`,
            val, id
        );

        return !!result.affectedRows;
    }

    async delete(id) {
        var result = await this.query(
            `DELETE FROM users WHERE (id = ?);
            DELETE FROM widgets WHERE (user_id = ?);
            DELETE FROM services WHERE (user_id = ?);`,
            id, id, id
        );

        return !!result[0].affectedRows;
    }
}

module.exports = new UserStorage();
