const { spawn, exec } = require("child_process");

function noop () {}

module.exports.Git = function (remoteName) {
    return {
        addSourceRepo: function addSourceRepo (source, cb) {
            return exec(`git remote add ${remoteName} ${source} -f`, cb || noop);
        },
        removeSourceRepo: function removeSourceRepo (cb) {
            return exec(`git remote remove ${remoteName}`, cb || noop);
        },
        listBranches: function listBranches (callbacks) {
            return spawnCb("git", ["branch", "--list", "-r", remoteName + "/*"], callbacks);
        }
    }
}

module.exports.Aws = function () {
    return {
        listFiles: function listFiles (bucket, callbacks) {
            return spawnCb("aws", ["s3", "ls", "--recursive", bucket], callbacks);
        }
    }
}

function spawnCb (cmd, args, { err, stdout, stderr, close }) {
    const child = spawn(cmd, args);
    child.stdout.on("data", data => { stdout && stdout(data) });
    child.stderr.on("data", data => { stderr && stderr(data) });
    child.on("close", code => { close && close(code) });
    child.on("error", data => { err && err(data) });
}

