#!/usr/bin/env node

const { rollup } = require("rollup");
const virtual = require("rollup-plugin-alias");
const json = require("rollup-plugin-json");
const { join } = require("path");
const yargs = require("yargs");

const argv = yargs
    .option("routes", {
        describe: "the .json file containing your app's routes.",
        alias: "r"
    })
    .option("output", {
        describe: "the path to write the compiled lambda function to.",
        alias: "o"
    })
    .argv;

const { routes, output } = argv;
const outFile = join(process.cwd(), output);

const inputOptions = {
    input: require.resolve("../lib/index.js"),
    plugins: [
        virtual({
            resolve: ['.json'],
            "../paths.json": join(process.cwd(), routes)
        }),
        json()
    ]
};

const outputOptions = {
    file: outFile,
    format: "cjs",
    sourcemap: false
};

function build() {
    return rollup(inputOptions)
        .then(bundle => bundle.write(outputOptions))
        .then(done => console.log("SPA app bundle written to", outFile))
        .catch(err => console.error("Error:", err));
}

build();
