/// <reference path="../typings/index.d.ts" />
"use strict";

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // Harvest energy
        {
            if(creep.carry.energy < creep.carryCapacity) {
                let sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }

                return;
            }
        }

        // Transfer energy
        {
            let structures = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.energy < structure.energyCapacity;
                }
            });

            if(structures.length > 0) {
                structures.sort((a,b) => a.hits - b.hits);

                if(creep.transfer(structures[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structures[0]);
                }

                return;
            }
        }

        // Build structures
        {
            let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(constructionSites.length) {
                if(creep.build(constructionSites[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0]);
                }

                return;
            }
        }

        // Repair structures
        {
            let structures = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });

            if(structures.length > 0) {
                structures.sort((a,b) => a.hits - b.hits);

                if(creep.repair(structures[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structures[0]);
                }

                return;
            }
        }

        // Upgrade controller
        if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
};