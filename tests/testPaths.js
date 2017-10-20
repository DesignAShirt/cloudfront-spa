const { expect } = require("chai");

const { getHandler } = require("../getHandler.js");

const rootPaths = require("./data/roots.json");
const filePaths = require("./data/files.json");

const handler = getHandler(rootPaths, filePaths);

function makeTestRequest(uri) {
    return {
        Records: [{
            cf: {
                request: { uri }
            }
        }]
    };
}

describe("root URLs", () => {
    it("should match just the root", (cb) => {
        const rootUri = "/feature/test/";

        handler(
            makeTestRequest(rootUri),
            null,
            (err, req) => {
                expect(err).to.equal(null);
                expect(req.uri).to.equal(rootUri);
                cb();
            }
        );
    });

    it("should match a file under it", (cb) => {
        const rootUri = "/feature/test/";
        const testUri = "/feature/test/fsadfasdfasdfasdf";

        handler(
            makeTestRequest(testUri),
            null,
            (err, req) => {
                expect(err).to.equal(null);
                expect(req.uri).to.equal(rootUri);
                cb();
            }
        );
    });
});

describe("file URLs", () => {
    it("should match", (cb) => {
        const uri = "/feature/test/0.7a4a9ba23e084a202486.js";
        handler(
            makeTestRequest(uri),
            null,
            (err, req) => {
                expect(err).to.equal(null);
                expect(req.uri).to.equal(uri);
                cb();
            }
        );
    });
});

describe("missing URLs", () => {
    it("should pass through", (cb) => {
        const uri = "/this/is/not/a/file/or/root/url";
        handler(
            makeTestRequest(uri),
            null,
            (err, req) => {
                expect(err).to.equal(null);
                expect(req.uri).to.equal(uri);
                cb();
            }
        );
    });
});
