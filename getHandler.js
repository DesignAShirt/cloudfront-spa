function findRoute(roots, files, uri) {
    if (files.indexOf(uri) !== -1)
        return uri;
    else
        return roots.find(r => uri.startsWith(r));
}

exports.getHandler = function getHandler (rootPaths, filePaths) {
    return (evt, ctx, cb) => {
        const { request } = evt.Records[0].cf;

        let route = findRoute(rootPaths, filePaths, request.uri);

        if (route)
            request.uri = route;

        cb(null, request);
    }
};
