# Lambda SPA Router

A lambda@edge function to serve an SPA from an s3 site via cloudfront.

Add 2 files to the function: `roots.json` and `files.json`.

`roots.json` should be an array of app root URLs, `files.json` is an array of file paths.


For example, you can have a staging site and deploy every git branch to a folder in s3, with the branch name as the path. You can add a build step to update this lambda function after every deploy.

Use a list of git branches as root urls:

    git branch --list -r | awk -F origin '{print $2 "/"}' | node listToFile.js > roots.js

And a list of files in an s3 bucket as file URLs:

    aws s3 ls --recursive s3-bucket | awk '{print "/" $4}' | node listToFile.js > files.js


If somebody visits `<cloudfront id>.cloudfront.net/feature/branch1/editor?subtab=text&tab=text`, this app will check for the following paths:

 * `/feature/branch1/editor` from `files.json`
 * A path in `roots.json` that `/feature/branch1/editor` starts with, e.g. `/feature/branch1/`

If it can't find those URLs, it just passes the url straight through for cloudfront to handle.


The original purpose of this is to set up testing for the design studio. The root urls are generated from the git branch names, and each branch gets it's own deploy on s3. After a branch is created or removed, this function is redeployed with an updated routes.json file.

