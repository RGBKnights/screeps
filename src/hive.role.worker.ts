/// <reference path="../typings/index.d.ts" />
"use strict";

const enum WorkerState {
    Empty = 0,
    Full = 1,
}

const enum WorkerJob {
    SupplyBuildings = 2,
    UpgradeController = 3,
}

module.exports = {
    getBody: function(): Array<BodyPartType> {
        // 300 = 100, 50, 50, 50, 50
        return [WORK, CARRY, CARRY, MOVE, MOVE];
    },
    getName: function(): string {
        return "worker";
    },
    spawnUnitIfNeeded: function(room:Room, count: any, spawns:Array<Spawn>, sources:Array<Source>, friendlies:Array<Creep>, hostiles:Array<Creep>): boolean {
        if(!room.controller) {
            return null;
        }

        if(!room.controller.my) {
            return null;
        }

        if(room.controller.level > 1) {
            return null;
        }

        if(count > 3) {
            return null;
        }

        let spawn = _.first(spawns);
        if(spawn) {
            return null;
        }

        let body = this.getBody();
        let result = spawn.canCreateCreep(body, null);
        if(result !== OK) {
            return null;
        }

        let role = this.getName();
        let name = spawn.createCreep(body, null, { state: WorkerState.Empty, role: role });
        if(_.isString(name)) {
           return Game.creeps[name];
        } else {
            return null;
        }
    },
    run: function(creep: Creep) {
        if(creep.memory.state === WorkerState.Empty) {
            let sources = creep.room.find(FIND_SOURCES, {
                filter: (source: Source) => {
                    return source.energy > 0;
                }
            });
            let closest = creep.pos.findClosestByPath(sources);
            let result = creep.harvest(closest);
            if(result === ERR_NOT_IN_RANGE) {
                creep.moveTo(closest);
            } else if(result === ERR_FULL) {
                creep.memory.state = WorkerState.Full;
            }
        }

        if(creep.memory.state === WorkerState.Full1) {
            if(creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                creep.memory.state = WorkerJob.SupplyBuildings;
            } else {
                creep.memory.state = WorkerJob.UpgradeController;
            }
        }

        if(creep.memory.state === WorkerJob.SupplyBuildings) {
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
            let closest = creep.pos.findClosestByPath(needingEngery);
            let result = creep.transfer(closest, RESOURCE_ENERGY);
            if(result === ERR_NOT_IN_RANGE) {
                creep.moveTo(closest);
            } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.state = 0;
            }
        }

        if(creep.memory.state === WorkerJob.UpgradeController) {
            let result = creep.upgradeController(creep.room.controller);
            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.state = 0;
            }
        }

    }
};