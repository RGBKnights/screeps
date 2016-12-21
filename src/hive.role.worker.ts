/// <reference path="../typings/index.d.ts" />
"use strict";

module.exports = {
    getBody: function(): Array<BodyPartType> {
        // 300 = 100, 50, 50, 50, 50
        return [WORK, CARRY, CARRY, MOVE, MOVE];
    },
    getName: function(): string {
        return "worker";
    },
    shouldSpawn: function(room:Room,  count): boolean {
        if(!room.controller) {
            return false;
        }

        if(!room.controller.my) {
            return false;
        }

        if(room.controller.level > 1) {
            return false;
        }

        if(count > room.memory.totals.sources) {
            return false;
        }

        return true;
    },
    spawnUnit: function(room: Room, spawns:Array<Spawn>, sources:Array<Source>, creeps:Array<Creep>) {
        let body = this.getBody();
        let role = this.getName();

        let spawn = _.first(spawns);
        if(spawn) {
            return null;
        }

        let result = spawn.canCreateCreep(body, null);
        if(result !== OK) {
            return null;
        }

        let name = spawn.createCreep(body, null, { state: 0, role: role });
        if(!_.isString(name)) {
            return null;
        }

        return Game.creeps[name];
    },
    changeState: function() {
        
    },
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

        let engeryAvailable = (sourcesWithEngery.length > 0 || dropedEngery.length > 0);

        if(creep.memory.state === 0 && creep.carry.energy < creep.carryCapacity && engeryAvailable) {
            creep.memory.state = 1;
        }
        if(creep.memory.state === 1) {
            if(dropedEngery.length > 0) {
                let closest = creep.pos.findClosestByRange(dropedEngery);
                let result = creep.pickup(closest);
                if(result === OK) {
                    return;
                } else if(result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                } else {
                    creep.memory.state = 0;
                }
            } else {
                let closest = creep.pos.findClosestByRange(sourcesWithEngery);
                let result = creep.harvest(closest);
                if(result === OK) {
                    return;
                } else if(result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                } else {
                    creep.memory.state = 0;
                }
            }

            return;
        }

        // Transfer energy
        let needingEngery = creep.room.find(FIND_STRUCTURES, {
            filter: (structure: any) => {
                if(structure.structureType === STRUCTURE_SPAWN) {
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
        if(creep.memory.state === 0 && needingEngery.length > 0 && creep.carry.energy > 0) {
            creep.memory.state = 2;
        }
        if(creep.memory.state === 2) {
            if(creep.carry.energy === 0) {
                creep.memory.state = 0;
                return;
            }

            let closest = creep.pos.findClosestByRange(needingEngery);
            let result = creep.transfer(closest, RESOURCE_ENERGY);
            if (result === OK) {
                return;
            } else if(result === ERR_NOT_IN_RANGE) {
                creep.moveTo(closest);
            } else {
                creep.memory.state = 0;
            }

            return;
        }
    }
};