const assert        = require("assert");

const User          = require.main.require("./models/User");
const UserStorage   = require.main.require("./models/storage/UserStorage");

UserStorage.create = function(username, password) {
    return 42;
}

UserStorage.getById = function(id) {
    return {
        id: 42,
        username: "Donald Trump",
        password: "HugeWall",
        is_admin: false,
        is_banned: true
    }
}

describe("User", function() {
    describe("#constructor()", function() {
        it("assigns init data to appropriate attributes", function() {
            var data = {
                id:         42,
                username:   "Chuck Norris",
                password:   "qwertyuop",
                is_admin:   true,
                is_banned:  false,
            };
            var user = new User(data);

            assert.equal(user.id, data.id);
            assert.equal(user.username, data.username);
            assert.equal(user.password, data.password);
            assert.equal(user.isAdmin, data.is_admin);
            assert.equal(user.isBanned, data.is_banned);
        });
    });
    describe("#create()", function() {
        it("calls UserStorage's create() method and returns the returned id", async function() {
            var user = await User.create("A", "pass");

            assert.equal(user.id, 42);
            assert.equal(user.username, "A");
        });
    });
    describe("#get()", function() {
        it("calls UserStorage's get() method and creates a user from its data", async function() {
            var user = await User.get(42);

            assert.equal(user.id, 42);
            assert.equal(user.username, "Donald Trump");
            assert.equal(user.isAdmin, false);
            assert.equal(user.isBanned, true);
        });
    });
    describe("User#getPasswordHash()", function() {
        it("gets the hash of a provided salted password", function() {
            assert.equal(User.getPasswordHash("Chuck", "Norris"), "0d861b74Norris");
            assert.equal(User.getPasswordHash("Bruce", "Willis"), "7e70ef94Willis");
            assert.equal(User.getPasswordHash("Van", "Damme"), "21bbc3d4Damme");
        });
    });
    describe("User#verifyPasswordHash()", function() {
        it("verifies a valid hashed password with a salt", function() {
            assert.equal(User.verifyPasswordHash("Chuck", "0d861b74Norris"), true);
            assert.equal(User.verifyPasswordHash("Bruce", "7e70ef94Willis"), true);
            assert.equal(User.verifyPasswordHash("Van", "21bbc3d4Damme"), true);
        });
        it("fails to verify an invalid password", function() {
            assert.equal(User.verifyPasswordHash("Chucky", "0d861b74Norris"), false);
            assert.equal(User.verifyPasswordHash("Brucey", "7e70ef94Willis"), false);
            assert.equal(User.verifyPasswordHash("Vannie", "21bbc3d4Damme"), false);
        });
    });
});
