const rootPaths = require("./roots.json");
const filePaths = require("./files.json");

const { getHandler } = require("./getHandler");

exports.handler = getHandler(rootPaths, filePaths);
