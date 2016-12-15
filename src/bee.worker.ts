/// <reference path="../typings/index.d.ts" />
"use strict";

let creepState = {
    pending:0,
    harvesting:1,
    transfering:2,
    building:3,
    repairing:4,
    upgrading:5,
    storing:6
};

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep: Creep) {

        // Harvest energy
        let sourcesWithEngery = creep.room.find(FIND_SOURCES, {
            filter: (source: Source) => {
                return source.energy > 0;
            }
        });

        // Pickup energy
        let dropedEngery = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: (res: Resource) => {
                return res.resourceType === RESOURCE_ENERGY;
            }
        });

        if(creep.memory.state === creepState.pending && creep.carry.energy < creep.carryCapacity && (sourcesWithEngery.length > 0 || dropedEngery.length > 0)) {
            creep.memory.state = creepState.harvesting;
            creep.say("harvest");
        }
        if(creep.memory.state === creepState.harvesting) {
            if(dropedEngery.length > 0) {
                let closest = creep.pos.findClosestByRange(dropedEngery);
                let result = creep.pickup(closest);
                if(result === OK) {
                    return;
                } else if(result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                } else {
                    creep.memory.state = creepState.pending;
                }
            } else {
                let closest = creep.pos.findClosestByRange(sourcesWithEngery);
                let result = creep.harvest(closest);
                if(result === OK) {
                    return;
                } else if(result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                } else {
                    creep.memory.state = creepState.pending;
                }
            }

            return;
        }

        // Transfer energy
        let structuresNeedingEngery = creep.room.find(FIND_STRUCTURES, {
            filter: (structure: any) => {
                if(structure.structureType === STRUCTURE_TOWER) {
                    let tower = structure as StructureTower;
                    return tower.energy < ( tower.energyCapacity * 0.5);
                } else if(structure.structureType === STRUCTURE_SPAWN) {
                    let spawn = structure as StructureSpawn;
                    return spawn.energy < spawn.energyCapacity;
                } else if(structure.structureType === STRUCTURE_EXTENSION) {
                    let extension = structure as StructureExtension;
                    return extension.energy < extension.energyCapacity;
                } else {
                    return false;
                }
            }
        });
        if(creep.memory.state === creepState.pending && structuresNeedingEngery.length > 0 && creep.carry.energy > 0) {
            creep.memory.state = creepState.transfering;
            creep.say("transfer");
        }
        if(creep.memory.state === creepState.transfering)
        {
            if(creep.carry.energy === 0) {
                creep.memory.state = creepState.pending;
                return;
            }

            let closest = creep.pos.findClosestByRange(structuresNeedingEngery);
            let result = creep.transfer(closest, RESOURCE_ENERGY);
            if (result === OK) {
                return;
            } else if(result === ERR_NOT_IN_RANGE) {
                creep.moveTo(closest);
            } else {
                creep.memory.state = creepState.pending;
            }

            return;
        }

        // Build structures
        let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(creep.memory.state === creepState.pending && constructionSites.length > 0 && creep.carry.energy > 0) {
            creep.memory.state = creepState.building;
            creep.say("build");
        }
        if(creep.memory.state === creepState.building) {
            if(creep.carry.energy === 0) {
                creep.memory.state = creepState.pending;
                return;
            }

            constructionSites.sort((a,b) => (a.progress/a.progressTotal) - (b.progress/b.progressTotal));

            let result = creep.build(constructionSites[0]);
            if (result === OK) {
                return;
            } else if(result === ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSites[0]);
            } else {
                creep.memory.state = creepState.pending;
            }

            return;
        }

        // Upgrade controller
        if(creep.memory.state === creepState.pending && creep.carry.energy > 0 && creep.room.controller) {
            creep.memory.state = creepState.upgrading;
            creep.say("upgrade");
        }
        if(creep.memory.state === creepState.upgrading) {
            if(creep.carry.energy === 0) {
                creep.memory.state = creepState.pending;
                return;
            }

            let result = creep.upgradeController(creep.room.controller);
            if (result === OK) {
                return;
            } else if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }

            return;
        }

    }
};