/// <reference path="../typings/index.d.ts" />
"use strict";

module.exports = {
    getBody: function(): Array<BodyPartType> {
        // 300 = 100, 50, 50, 50, 50
        return [WORK, WORK, CARRY, MOVE, MOVE];
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

        if(room.controller.level < 1) {
            return false;
        }

        if(count > 1) {
            return false;
        }

        return true;
    },
    run: function(creep: Creep) {
        return;
    }
};