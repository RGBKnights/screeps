/// <reference path="../typings/index.d.ts" />
"use strict";

module.exports = {
    getBody: function(): Array<BodyPartType> {
        return [WORK, WORK, MOVE, MOVE];
    },
    getName: function(): string {
        return "minner";
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

        if(count >= sources.length) {
            return null;
        }

        let minner = _.filter(friendlies, (creep:Creep) => creep.memory.role === "minner");
        let allSource = _.map(sources, (source:Source) => source.id).sort();
        let takenSource = _.map(minner, (creep:Creep) => creep.memory.source).sort();
        let delta = _.difference(allSource, takenSource);

        if(delta.length === 0) {
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
        let name = spawn.createCreep(body, null, { state: 0, role: role, source: delta[0] });
        if(_.isString(name)) {
            return Game.creeps[name];
        } else {
            return null;
        }
    },
    run: function(creep: Creep) {
        let source = Game.getObjectById(creep.memory.source) as Source;
        if(source) {
            if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};