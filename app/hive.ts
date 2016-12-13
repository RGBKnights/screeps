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

        for(let i in Memory.rooms) {
            if(!Game.rooms[i]) {
                delete Memory.rooms[i];
            }
        }
    },
    checkControllerState: function() {
        if(Game.rooms["W8N6"].controller.ticksToDowngrade < 1000) {
            Game.creeps[0].memory.state = 5;
        }
    },
    createWorkers: function(limit) {
        let body1 = [WORK,CARRY,MOVE];
        let body2 = [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
        let body3 = [WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];

        let size = _(Game.creeps).size();
        if(size < limit) {
            let result = Game.spawns["Spawn1"].createCreep(body2, null, { state: 0 });
            if(_.isString(result)) {
                console.log("Spawning:" + result);
            }
        }
    },
    processTowers: function() {
        let towers = Game.rooms["W8N6"].find(FIND_STRUCTURES, {
            filter: (structure: Structure) =>  structure.structureType === STRUCTURE_TOWER
        });
        if(towers.length > 0) {
            let tower = towers[0] as StructureTower;

            let structures = Game.rooms["W8N6"].find(FIND_STRUCTURES, {
                filter: (structure: Structure) => structure.hits < structure.hitsMax
            });
            if(structures.length > 0) {
                structures.sort((a,b) => a.hits - b.hits);
                tower.repair(structures[0]);
            } else {
                let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(closestHostile) {
                    tower.attack(closestHostile);
                }
            }
        }
    },
    processWorkers: function() {
        _.forEach(Game.creeps, function(creep) {
            woker.run(creep);
        });
    }
};