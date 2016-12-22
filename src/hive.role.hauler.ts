/// <reference path="../typings/index.d.ts" />
"use strict";

module.exports = {
    getBody: function(): Array<BodyPartType> {
        return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
    },
    getName: function(): string {
        return "hauler";
    },
    shouldSpawn: function(room:Room, count): boolean {
        if(!room.controller) {
            return false;
        }

        if(!room.controller.my) {
            return false;
        }

        if(room.controller.level < 2) {
            return false;
        }

        if(count >= (room.controller.level * 5)) {
            return false;
        }

        let energy = room.find(FIND_DROPPED_RESOURCES, { filter: (res: Resource) => res.resourceType === RESOURCE_ENERGY });
        if(energy.length === 0) {
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
    run: function(creep: Creep) {

        if(creep.memory.state === 0) {
            let resources = creep.room.find(FIND_DROPPED_RESOURCES, { filter: (res: Resource) => res.resourceType === RESOURCE_ENERGY });
            if(resources.length > 0) {
                let closest = creep.pos.findClosestByPath(resources);
                let result = creep.pickup(closest);
                if(result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                } else if(result === ERR_FULL) {
                    creep.memory.state = 1;
                }
            }

        }

        if(creep.memory.state === 1) {
            if(creep.room.energyAvailable === creep.room.energyCapacityAvailable) {
                let upgraders = creep.room.find(FIND_MY_CREEPS, { filter: (c:Creep) => c.memory.role === "upgrader" });
                if(upgraders.length > 0) {
                    let closest = creep.pos.findClosestByPath(upgraders);
                    let result = creep.transfer(closest, RESOURCE_ENERGY);
                    if(result === ERR_NOT_IN_RANGE) {
                        creep.moveTo(closest);
                    } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
                        creep.memory.state = 0;
                    }
                }
            } else {
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
                if(needingEngery.length > 0) {
                    let closest = creep.pos.findClosestByPath(needingEngery);
                    let result = creep.transfer(closest, RESOURCE_ENERGY);
                    if(result === ERR_NOT_IN_RANGE) {
                        creep.moveTo(closest);
                    } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
                        creep.memory.state = 0;
                    }
                }
            }
        }
    }
};