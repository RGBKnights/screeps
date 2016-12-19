/// <reference path="../typings/index.d.ts" />
"use strict";

module.exports = {
    getBody: function(): Array<BodyPartType> {
        // 300 = 100, 50, 50, 50, 50
        return [WORK, CARRY, CARRY, MOVE, MOVE];
    }
    run: function(creep: Creep) {
        
    }
};