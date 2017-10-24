# Lambda SPA Router

A lambda@edge function to serve single page apps from an s3 site via Cloudfront.

Create a file named `paths.json`. It should look like this:

  {
    "rootPaths": ["/path1/", "/path2", ...],
    "filePaths": ["/path1/somefile.css", "/path1/script.js", ...]
  }


For example, you can use this for a staging site hosted with s3 and Cloudfront. If you deploy every git branch from your project to a folder in s3, with the branch name as the path, you can add a build step to update the lambda@edge function after every deploy. Every branch will have it's own single page app.

`tools/build-path-file.sh` will create the paths file from a git repo and an s3 bucket:

    ./tools/build-path-file.sh git@github.com:user/project.git some-s3-bucket > paths.json


If somebody visits `<cloudfront id>.cloudfront.net/feature/branch1/editor?subtab=text&tab=text`, this app will check for the following paths:

 * `/feature/branch1/editor` from `filePaths`
 * A path in `rootPaths` that `/feature/branch1/editor` starts with, e.g. `/feature/branch1/`

If it can't find those URLs, it just passes the url straight through for cloudfront to handle.


