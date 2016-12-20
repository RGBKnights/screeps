/// <reference path="../typings/index.d.ts" />
"use strict";

module.exports = {
    getBody: function(): Array<BodyPartType> {
        // 300 = 100, 100, 50, 50
        return [WORK, WORK, MOVE, MOVE];
    },
    getName: function(): string {
        return "minner";
    },
    shouldSpawn: function(room:Room, count): boolean {
        if(count > room.memory.totals.sources) {
            return false;
        }

        return true;
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