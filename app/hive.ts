/// <reference path="../typings/index.d.ts" />
"use strict";

let woker = require("bee.worker");

module.exports = {

    reset: function() {
        // Creep Memory
        for(let i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
    },
    processWorkers: function() {
        _.forEach(Game.creeps, function(creep) {
            woker.run(creep);
        });
    }
};