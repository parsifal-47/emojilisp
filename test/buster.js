var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "node", // or "browser"
    sources: [
        "interpreter/*.js",
    ],
    tests: [
        "test/*-test.js"
    ]
}
