/// <reference path="../typings/index.d.ts" />
"use strict";

import * as _ from "lodash";

let hive = require("hive");

module.exports.loop = function () {
    // Cleanup hive
    hive.reset();

    // Create new workers if needed
    hive.createWorkers(5);

    // Game.rooms["W8N6"].lookAt(17, 27)[0].type == terrain 
    // Game.rooms["W8N6"].lookAt(17, 27)[0].terrain

    // Process Workers
    hive.processWorkers();
};