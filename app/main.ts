/// <reference path="../typings/index.d.ts" />
"use strict";

import * as lodash from "lodash";

let hive = require("hive");

module.exports.loop = function () {
    // Cleanup Mem.
    hive.reset();

    // Update Hive State

    // Create Work Orders
    // Update Work Orders
    // Process Work Orders
    hive.processWorkers();
}