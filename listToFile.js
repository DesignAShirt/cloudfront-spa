/**
 * Take a list of items from stdin, and create a json file with an array.
 */

process.stdin.setEncoding("utf8");

var rows = [];

process.stdin.on("readable", () => {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        chunk
            .split("\n")
            .map(r => r.trim())
            .filter(r => r.length !== 0)
            .forEach(r => rows.push(r));
    }
});

process.stdin.on("end", () => {
    process.stdout.write(JSON.stringify(rows, null, "    "));
});

