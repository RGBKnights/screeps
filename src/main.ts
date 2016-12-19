/// <reference path="../typings/index.d.ts" />
"use strict";

let hive = require("hive");

module.exports.loop = function () {
    // free resources from memory
    hive.freeMemory();
    // Main hive loop
    hive.loop();
};