const crypto        = require("crypto");

const UserStorage   = require("./storage/UserStorage");
const Utils         = require("./Utils");

class User {
    constructor(data) {
        this.id         = data.id;
        this.username   = data.username;
        this.password   = data.password;
        this.isAdmin    = data.is_admin;
        this.isBanned   = data.is_banned;
    }

    static async create(username, password) {
        var hash    = User.getPasswordHash(password, Utils.getRandomStr(8));
        var id      = await UserStorage.create(username, hash);

        if (!id)
            throw Error("duplicate username");
        return new User({
            id,
            username,
            password: hash,
            is_admin: false
        });
    }

    static async get(id) {
        var data = await UserStorage.getById(id);

        return data ? new User(data) : null;
    }

    static async authenticate(username, password) {
        var data = await UserStorage.getByUsername(username);

        if (!data)
            throw Error("user not found");
        if (!User.verifyPasswordHash(password, data.password))
            throw Error("invalid password");
        if (data.is_banned)
            throw Error(`user banned. Please contact an admin for support.`);
        return new User(data);
    }

    static async authByService(service_name, service_user_id) {
        var data = await UserStorage.getByServiceId(
            service_name,
            service_user_id
        );

        if (!data)
            throw Error(`this ${service_name} account is not linked`);
        if (data.is_banned)
            throw Error(`user banned. Please contact an admin for support.`);
        return new User(data);
    }

    static getPasswordHash(password, salt) {
        return crypto.createHash("md5")
            .update(password + salt)
            .digest("hex")
            .substr(0, 8)
            + salt;
    }

    static verifyPasswordHash(password, salted_hash) {
        var hash = salted_hash.substr(0, 8);
        var salt = salted_hash.substr(8);

        return crypto.createHash("md5")
            .update(password + salt)
            .digest("hex")
            .substr(0, 8) == hash;
    }

    setAdmin(val) {
        return UserStorage.setAdmin(this.id, val);
    }

    setBanned(val) {
        return UserStorage.setBanned(this.id, val);
    }

    delete(val) {
        return UserStorage.delete(this.id);
    }
}

module.exports = User;
