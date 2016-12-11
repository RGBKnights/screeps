/// <reference path="../typings/index.d.ts" />
"use strict";

import * as lodash from "lodash";

let hive = require("hive");

module.exports.loop = function () {
    // Cleanup hive
    hive.reset();

    // Create new workers if needed
    hive.createWorkers(5);

    // Process Workers
    hive.processWorkers();
};