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
    file: join(process.cwd(), output),
    format: "cjs",
    sourcemap: false
};

async function build() {
    try {
        const bundle = await rollup(inputOptions);
        await bundle.write(outputOptions);
    } catch (x) {
        console.error("Error:", x);
    }
}

build();
