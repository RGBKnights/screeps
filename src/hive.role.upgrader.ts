/// <reference path="../typings/index.d.ts" />
"use strict";

module.exports = {
    getBody: function(): Array<BodyPartType> {
        return [WORK, CARRY, CARRY, MOVE, MOVE];
    },
    getName: function(): string {
        return "upgrader";
    },
    spawnUnitIfNeeded: function(room:Room, count: any, spawns:Array<Spawn>, sources:Array<Source>, friendlies:Array<Creep>, hostiles:Array<Creep>): Creep {
        if(!room.controller) {
            return null;
        }

        if(!room.controller.my) {
            return null;
        }

        if(room.controller.level < 1) {
            return null;
        }

        if(count >= 3) {
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
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
};