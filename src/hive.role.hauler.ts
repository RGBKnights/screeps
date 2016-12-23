/// <reference path="../typings/index.d.ts" />
"use strict";

module.exports = {
    getBody: function(): Array<BodyPartType> {
        return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
    },
    getName: function(): string {
        return "hauler";
    },
    spawnUnitIfNeeded: function(room:Room, count: any, spawns:Array<Spawn>, sources:Array<Source>, friendlies:Array<Creep>, hostiles:Array<Creep>): Creep {
        if(!room.controller) {
            return null;
        }

        if(!room.controller.my) {
            return null;
        }

        if(room.controller.level < 2) {
            return null;
        }

        let energy = room.find(FIND_DROPPED_RESOURCES, { filter: (res: Resource) => res.resourceType === RESOURCE_ENERGY });
        if(energy.length === 0) {
            return null;
        }

        let minners = _.filter(friendlies, (creep:Creep) => creep.memory.role === "minner");
        if(count >= minners.length) {
            return null;
        }


        let spawn = _.first(spawns);
        if(!spawn) {
           return null;
        }

        let body = this.getBody();
        let result = spawn.canCreateCreep(body, null);
        if(result !== OK) {
            return null;
        }

        let role = this.getName();
        let name = spawn.createCreep(body, null, { state: 0, role: role });
        if(_.isString(name)) {
            return Game.creeps[name];
        } else {
            return null;
        }
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
                    upgraders.sort((a,b) => a.carry.energy - b.carry.energy);
                    let closest = _.first(upgraders);
                    let result = creep.transfer(closest, RESOURCE_ENERGY);
                    if(result === ERR_NOT_IN_RANGE) {
                        creep.moveTo(closest);
                    } else {
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
                    } else {
                        creep.memory.state = 0;
                    }
                }
            }
        }
    }
};