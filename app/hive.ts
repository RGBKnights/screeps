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
    createWorkers: function(limit) {
        let size = _(Game.creeps).size();
        if(size < limit) {
            let result = Game.spawns["W8N6-1"].createCreep([WORK,CARRY,MOVE], null);
            if(_.isString(result)) {
                console.log("Spawning:" + result);
            }
        }
    },
    processWorkers: function() {
        _.forEach(Game.creeps, function(creep) {
            woker.run(creep);
        });
    }
};