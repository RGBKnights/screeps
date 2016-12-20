/// <reference path="../typings/index.d.ts" />
"use strict";

module.exports = {
    getBody: function(): Array<BodyPartType> {
        // 300 = 50, 50, 50, 50, 50, 50
        return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
    },
    getName: function(): string {
        return "hauler";
    },
    shouldSpawn: function(room:Room, count): boolean {
        return false;
    },
    spawnUnit: function(body: Array<BodyPartType>, room: Room, spawns:Spawn, sources:Source, creeps:Array<Creep>) {
        let spawn = _.first(spawns);
        if(spawn) {
            let result = spawn.canCreateCreep(body, null);
            if(result === OK) {
                spawn.createCreep(body, null, { role: role.getName() });
            }
        }
    }
    run: function(creep: Creep) {
        return;
    }
};