/// <reference path="../typings/index.d.ts" />
"use strict";

import * as _ from "lodash";

let hive = require("hive");

module.exports.loop = function () {
    // Cleanup hive
    hive.reset();
    hive.createWorkers(5);
    hive.checkControllerState();
    hive.processTowers();
    hive.processWorkers();
};