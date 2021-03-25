const Storage = require("./Storage");

class WidgetStorage extends Storage {
    constructor() {
        super();
    }

    async create(user_id, service_name, type, order, data = {}) {
        var result = await this.query(
            `INSERT
                INTO widgets (user_id, service, type, \`order\`, data)
                VALUES (?, ?, ?, ?, ?);`,
            user_id, service_name, type, order, JSON.stringify(data)
        )

        return result.insertId;
    }

    async get(user_id, widget_id) {
        return (await this.query(
            `SELECT *
                FROM widgets
                WHERE widget_id = ? AND user_id = ?
                LIMIT 1`,
            widget_id, user_id
        ))[0];
    }

    async list(user_id) {
        var result = await this.query(
            `SELECT widget_id, service, type, \`order\`, data
                FROM dashboard.widgets
                WHERE user_id = ?;`,
            user_id
        );

        return result;
    }

    async setOrder(widget_id, user_id, order) {
        var result = await this.query(
            `UPDATE widgets
                SET \`order\` = ?
                WHERE widget_id = ? AND user_id = ?;`,
            order, widget_id, user_id
        );

        return !!result.affectedRows;
    }

    async setData(widget_id, user_id, data = {}) {
        var result = await this.query(
            `UPDATE widgets
                SET data = ?
                WHERE widget_id = ? AND user_id = ?;`,
            JSON.stringify(data), widget_id, user_id
        );

        return !!result.affectedRows;
    }

    async delete(user_id, widget_id) {
        var result = await this.query(
            `DELETE FROM widgets
                WHERE user_id = ? AND widget_id = ?;`,
            user_id, widget_id
        );

        return !!result.affectedRows;
    }
}

module.exports = new WidgetStorage();
