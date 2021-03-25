const assert    = require("assert");

const signin    = require.main.require("./controllers/api/signin");
const User      = require.main.require("./models/User");

describe("API.signin", function() {
    before(function() {
        User.authenticate = function(username, password) {
            return `<authenticated User with ${username}:${password}>`;
        }
    });

    describe("#signIn()", function() {
        it("throws an error if the username is empty", function() {
            assert.rejects(async () => {
                await signin.signIn({username: undefined, password: "qwerty"});
            });
        });
        it("throws an error if the password is empty", function() {
            assert.rejects(async () => {
                await signin.signIn({username: "JamesBond", password: undefined});
            });
        });
        it("throws an error if the username is too short", function() {
            assert.rejects(async () => {
                await signin.signIn({username: "_", password: "qwerty"});
            });
        });
        it("throws an error if the username is too long", function() {
            assert.rejects(async () => {
                await signin.signIn({username: "Supercalifragilisticexpialidocious", password: "qwerty"});
            });
        });
        it("throws an error if the password is too short", function() {
            assert.rejects(async () => {
                await signin.signIn({username: "JamesBond", password: "_"});
            });
        });
        it("throws an error if the password is too long", function() {
            assert.rejects(async () => {
                await signin.signIn({username: "JamesBond", password: "Supercalifragilisticexpialidocious"});
            });
        });
        it("calls User's authenticate() method if username and password match all constraints", async function() {
            var result = await signin.signIn({username: "JamesBond", password: "shaken_martini"});

            assert.equal(result, "<authenticated User with JamesBond:shaken_martini>");
        });
    });
});
