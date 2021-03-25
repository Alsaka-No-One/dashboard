const assert            = require("assert");

const linked_services   = require.main.require("./controllers/api/linked_services");
const ServiceStorage    = require.main.require("./models/storage/ServiceStorage");

describe("API.linked_services", function() {
    describe("#getLinkedServices()", function() {
        it("returns a valid linked services object with all values set to false", async function() {
            ServiceStorage.getLinkedServices = async function(id) {
                return [];
            }

            var result = await linked_services.getLinkedServices(42);
            assert.deepEqual(result, {
                telegram: false,
                discord: false,
                gitlab: false,
                github: false
            });
        });
        it("returns a valid linked services object with all values set to true", async function() {
            ServiceStorage.getLinkedServices = async function(id) {
                return ["telegram", "discord", "gitlab", "github"];
            }

            var result = await linked_services.getLinkedServices(42);
            assert.deepEqual(result, {
                telegram: true,
                discord: true,
                gitlab: true,
                github: true
            });
        });
        it("returns a valid linked services object", async function() {
            ServiceStorage.getLinkedServices = async function(id) {
                return ["telegram", "gitlab"];
            }

            var result = await linked_services.getLinkedServices(42);
            assert.deepEqual(result, {
                telegram: true,
                discord: false,
                gitlab: true,
                github: false
            });
        });
    });
});
