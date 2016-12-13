/// <reference path="../typings/index.d.ts" />
"use strict";

let creepState = {
    pending:0,
    harvesting:1,
    transfering:2,
    building:3,
    repairing:4,
    upgrading:5
};

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep: Creep) {

        // Harvest energy
        if(creep.memory.state === creepState.pending && creep.carry.energy === 0) {
            creep.memory.state = creepState.harvesting;
            //creep.say("harvest");
        }
        if(creep.memory.state === creepState.harvesting) {
            if(creep.carry.energy < creep.carryCapacity) {
                let sources = creep.room.find(FIND_SOURCES);
                let result = creep.harvest(sources[0]);
                if(result === ERR_NOT_IN_RANGE) {
                    if(creep.moveTo(sources[0]) === ERR_NO_PATH) {
                        let closetCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                            filter: function(c) {
                                return c.carry.energy === creep.carryCapacity;
                            }
                        });
                        if(closetCreep) {
                            if(closetCreep.transfer(creep, RESOURCE_ENERGY) === OK) {
                                if(creep.carry.energy === creep.carryCapacity) {
                                    creep.memory.state = creepState.pending;
                                }
                            }
                        }
                    }
                } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
                    creep.memory.state = creepState.pending;
                }
            } else {
                creep.memory.state = creepState.pending;
            }

            return;
        }

        // Transfer energy
        let structuresNeedingEngery = creep.room.find(FIND_STRUCTURES, {
            filter: (structure: any) => {
                if(structure.structureType === STRUCTURE_TOWER) {
                    return structure.energy < ( structure.energyCapacity * 0.5);
                } else {
                    return structure.energy < structure.energyCapacity;
                }
            }
        });
        if(creep.memory.state === creepState.pending && structuresNeedingEngery.length > 0) {
            creep.memory.state = creepState.transfering;
            //creep.say("transfer");
        }
        if(creep.memory.state === creepState.transfering)
        {
            if(creep.carry.energy > 0) {
                structuresNeedingEngery.sort((a,b) => a.energyCapacity - b.energyCapacity);

                let result = creep.transfer(structuresNeedingEngery[0], RESOURCE_ENERGY);
                if(result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structuresNeedingEngery[0]);
                } else {
                    creep.memory.state = creepState.pending;
                }
            } else{
                creep.memory.state = creepState.pending;
            }

            return;
        }

        // Build structures
        let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(creep.memory.state === creepState.pending && constructionSites.length > 0) {
            creep.memory.state = creepState.building;
            //creep.say("build");
        }
        if(creep.memory.state === creepState.building) {
            if(creep.carry.energy > 0) {
                constructionSites.sort((a,b) => a.progress - b.progress);

                if(creep.build(constructionSites[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0]);
                } else {
                    creep.memory.state = creepState.pending;
                }
            } else {
                creep.memory.state = creepState.pending;
            }

            return;
        }

        // Repair structures
        /*
        let structuresNeedingRepair = creep.room.find(FIND_STRUCTURES, {
            filter: (structure: any) => {
                return structure.hits < structure.hitsMax;
            }
        });
        if(creep.memory.state === creepState.pending && structuresNeedingRepair.length > 0) {
            creep.memory.state = creepState.repairing;
            //creep.say("repair");
        }
        if(creep.memory.state === creepState.repairing)
        {
            if(creep.carry.energy > 0) {
                structuresNeedingRepair.sort((a,b) => a.hits - b.hits);

                if(creep.repair(structuresNeedingRepair[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structuresNeedingRepair[0]);
                }
            } else {
                creep.memory.state = creepState.pending;
            }

            return;
        }
        */

        // Upgrade controller
        if(creep.memory.state === creepState.pending && creep.carry.energy > 0) {
            creep.memory.state = creepState.upgrading;
            //creep.say("upgrade");
        }
        if(creep.memory.state === creepState.upgrading) {
            if(creep.carry.energy > 0) {
                if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            } else {
                creep.memory.state = creepState.pending;
            }

            return;
        }

    }
};