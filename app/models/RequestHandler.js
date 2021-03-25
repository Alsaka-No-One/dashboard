const http_statuses = require("./http_statuses.json");

class RequestHandler {
    static sendError(req, res, status = 400, description = null) {
        status = http_statuses[status] ? status : 400;
        RequestHandler.render(
            req,
            res,
            "error",
            {status, description: description || http_statuses[status], status},
            status
        );
    }

    static render(req, res, page, data = {}, status = 200) {
        res.status(status).render(
            page,
            {
                user: req.session.user,
                page,
                ...data
            }
        )
    }

    static all(req, res) {
        return RequestHandler.sendError(req, res, 405);
    }
}

module.exports = RequestHandler;
