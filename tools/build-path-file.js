#!/usr/bin/env node

const foreign = require("./helpers/foreign");

const argv = require("yargs")
    .option("remote", {
        describe: "The git repo to use as app root URLs.",
        alias: "r"
    })
    .option("s3bucket", {
        describe: "the s3 bucket to get valid file paths from.",
        alias: "s"
    })
    .argv;

const { remote, s3bucket } = argv;

const SOURCE_REPO = "__source_repo__";

const git = foreign.Git(SOURCE_REPO);
const aws = foreign.Aws();



const output = {
    rootPaths: null,
    filePaths: null
};

getGitPaths(remote, (err, paths) => {
    output.rootPaths = paths;
    done(output);
});

getAwsPaths(s3bucket, (err, paths) => {
    output.filePaths = paths;
    done(output);
});

function done(output) {
    if (output.rootPaths !== null && output.filePaths !== null)
        console.log(JSON.stringify(output));
}



function getGitPaths(remote, cb) {
    var paths = [];
    git.addSourceRepo(remote, (error, stdout, stderr) => {
        git.listBranches({
            stdout (data) {
                paths = paths.concat(
                    splitRows(data.toString())
                        .map(getColumn(0))
                        .map(c => c.replace(SOURCE_REPO, ''))
                        .map(c => `${c}/`)
                );
            },
            close (code) {
                git.removeSourceRepo();
                cb(null, paths);
            }
        });
    });
}

function getAwsPaths(bucket, cb) {
    var paths = [];
    aws.listFiles(s3bucket, {
        stdout (data) {
            paths = paths.concat(
                splitRows(data.toString())
                    .map(getColumn(3))
                    .map(col => `/${col.trim()}`)
            );
        },
        close (code) {
            cb(null, paths);
        }
    });
}

function splitRows (data) {
    return data.trim().split("\n");
}

function getColumn (index) {
    return function splitColumns(data) {
        return data.trim().split(/\s+/)[index];
    }
}

