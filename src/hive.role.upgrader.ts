/// <reference path="../typings/index.d.ts" />
"use strict";

module.exports = {
    getBody: function(): Array<BodyPartType> {
        return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    },
    getName: function(): string {
        return "upgrader";
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

        if(count >= (room.controller.level * 2)) {
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
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
};