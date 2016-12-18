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
    createWorkers: function(limit) {

        // let body1 = [WORK, CARRY, MOVE];
        let body2 = [WORK,WORK, CARRY,CARRY, MOVE,MOVE];
        // let body3 = [WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE];
        // let body4 = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];

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
        _.forEach(towers, function(tower: StructureTower) {
            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
                return;
            }

            let ramparts = Game.rooms["W8N6"].find(FIND_STRUCTURES, {
                filter: (structure: Structure) => structure.structureType === STRUCTURE_RAMPART && structure.hits < structure.hitsMax
            });
            if(ramparts.length > 0) {
                ramparts.sort((a,b) => a.hits - b.hits);
                tower.repair(ramparts[0]);
                return;
            }

            let walls = Game.rooms["W8N6"].find(FIND_STRUCTURES, {
                filter: (structure: Structure) => structure.structureType === STRUCTURE_WALL && structure.hits < structure.hitsMax
            });
            if(walls.length > 0) {
                walls.sort((a,b) => a.hits - b.hits);
                tower.repair(walls[0]);
                return;
            }

            let closestFrendly = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (creep: Creep) => creep.hits < creep.hitsMax
            });
            if(closestFrendly) {
                tower.heal(closestFrendly);
                return;
            }
        });
    },
    processWorkers: function() {
        _.forEach(Game.creeps, function(creep) {
            woker.run(creep);
        });
    }
};