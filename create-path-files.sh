git remote add source_repo $1 -f
git branch --list -r source_repo/* | awk -F source_repo '{print $2 "/"}' | node listToFile.js > roots.json
git remote remove  source_repo

aws s3 ls --recursive $2 | awk '{print "/" $4}' | node listToFile.js > files.json
