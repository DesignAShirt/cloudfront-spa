function findRoute(roots, files, uri) {
    if (files.indexOf(uri) !== -1)
        return uri;
    else
        return roots.find(r => uri.startsWith(r));
}

function serveHtml(html) {
    return {
        status: "200",
        statusDescription: "OK",
        headers: {
            "content-type": [{
                key: "Content-Type",
                value: "text/html"
            }],
            "content-encoding": [{
                key: "Content-Encoding",
                value: "UTF-8"
            }],
        },
        body: html
    };
}

function rootPathsPage(rootPaths) {
    const links = rootPaths
        .map(path => `<a href="${path}">${path}</a><br />`)
        .join("");
    return `<html><body>${links}</body></html>`;
}

export function getHandler (rootPaths, filePaths) {
    return (evt, ctx, cb) => {
        const { request } = evt.Records[0].cf;

        if (request.uri === "/rootpages.html") {
            const html = rootPathsPage(rootPaths);
            const response = serveHtml(html);
            return void cb(null, response);
        }

        let route = findRoute(rootPaths, filePaths, request.uri);

        if (route)
            request.uri = route;

        return void cb(null, request);
    }
};
