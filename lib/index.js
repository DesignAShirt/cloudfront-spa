import * as paths from "../paths.json";
import { getHandler } from "./getHandler";

const { rootPaths, filePaths } = paths;

export const handler = getHandler(rootPaths, filePaths);
