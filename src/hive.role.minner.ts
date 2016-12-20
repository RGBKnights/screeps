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
        return false;
    },
    run: function(creep: Creep) {
        return;
    }
};