/// <reference path="../typings/index.d.ts" />
"use strict";

let roleWorker = require("hive.role.worker");
let roleHauler = require("hive.role.upgrader");
let roleMinner = require("hive.role.minner");
let roleHauler = require("hive.role.hauler");

module.exports = {
    freeMemory: function() {
        // Creep Memory
        for(let i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
    },
    processWorkers: function() {
        
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'worker') {
                roleWorker.run(creep);
            } else if(creep.memory.role == 'minner') {
                roleMinner.run(creep);
            } else if(creep.memory.role == 'hauler') {
                roleHauler.run(creep);
            } else if(creep.memory.role == 'upgrader') {
                // roleUpgrader.run(creep);
            }
        }
    }
};