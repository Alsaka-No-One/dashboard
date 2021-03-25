const assert    = require("assert");

const signup    = require.main.require("./controllers/api/signup");
const User      = require.main.require("./models/User");

describe("API.signup", function() {
    before(function() {
        User.create = function(username, password) {
            return `<created User with ${username}:${password}>`;
        }
    });

    describe("#signUp()", function() {
        it("throws an error if the username is empty", function() {
            assert.rejects(async () => {
                await signup.signUp({username: undefined, password: "qwerty"});
            });
        });
        it("throws an error if the password is empty", function() {
            assert.rejects(async () => {
                await signup.signUp({username: "JamesBond", password: undefined});
            });
        });
        it("throws an error if the username is too short", function() {
            assert.rejects(async () => {
                await signup.signUp({username: "_", password: "qwerty"});
            });
        });
        it("throws an error if the username is too long", function() {
            assert.rejects(async () => {
                await signup.signUp({username: "Supercalifragilisticexpialidocious", password: "qwerty"});
            });
        });
        it("throws an error if the password is too short", function() {
            assert.rejects(async () => {
                await signup.signUp({username: "JamesBond", password: "_"});
            });
        });
        it("throws an error if the password is too long", function() {
            assert.rejects(async () => {
                await signup.signUp({username: "JamesBond", password: "Supercalifragilisticexpialidocious"});
            });
        });
        it("calls User's authenticate() method if username and password match all constraints", async function() {
            var result = await signup.signUp({username: "JamesBond", password: "shaken_martini"});

            assert.equal(result, "<created User with JamesBond:shaken_martini>");
        });
    });
});
