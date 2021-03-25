const assert = require("assert");

const Utils = require("../app/models/Utils");

describe("Utils", function() {
    describe("#unassign()", function() {
        it("unassigns a value if present", function() {
            assert.deepEqual(Utils.unassign({a: 1, b: 2}, "a"), {b: 2});
        });
        it("returns the same object if value is not present", function() {
            assert.deepEqual(Utils.unassign({a: 1, b: 2}, "c"), {a: 1, b: 2});
        });
        it("does not modify the original object", function() {
            var obj = {a: 1, b: 2}

            Utils.unassign(obj, "a")
            assert.deepEqual(obj, {a: 1, b: 2});
        });
    });
    describe("#querify()", function() {
        it("querifies a single param", function() {
            assert.deepEqual(Utils.querify({a: 1}), "a=1");
        });
        it("querifies multiple params", function() {
            assert.deepEqual(Utils.querify({a: 1, b: 2}), "a=1&b=2");
        });
        it("url-encodes params and values", function() {
            assert.deepEqual(Utils.querify({"=": 1, b: " "}), "%3D=1&b=%20");
        });
    });
    describe("#unquerify()", function() {
        it("unquerifies a single param", function() {
            assert.deepEqual(Utils.unquerify("a=1"), {a: 1});
        });
        it("unquerifies multiple params", function() {
            assert.deepEqual(Utils.unquerify("a=1&b=2"), {a: 1, b: 2});
        });
        it("url-decodes params and values", function() {
            assert.deepEqual(Utils.unquerify("%3D=1&b=%20"), {"=": 1, b: " "});
        });
    });
});
