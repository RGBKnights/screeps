/// <reference path="../typings/index.d.ts" />
"use strict";

module.exports = {
    getBody: function(): Array<BodyPartType> {
        return [RANGED_ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE];
    },
    getName: function(): string {
        return "artillery";
    },
    spawnUnitIfNeeded: function(room:Room, count: any, spawns:Array<Spawn>, sources:Array<Source>, friendlies:Array<Creep>, hostiles:Array<Creep>): boolean {
        if(!room.controller) {
            return null;
        }

        if(!room.controller.my) {
            return null;
        }

        if(room.controller.level < 2) {
            return null;
        }

        if(hostiles.length == 0) {
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
        let name = spawn.createCreep(body, null, { state: 0, role: role });
        if(_.isString(name)) {
            return Game.creeps[name];
        } else {
            return null;
        }
    },
    run: function(creep: Creep) {
        var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if(target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};