/// <reference path="../typings/index.d.ts" />
"use strict";

module.exports = {
    getBody: function(): Array<BodyPartType> {
        // 300 = 50, 50, 50, 50, 50, 50
        return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
    }
    run: function(creep: Creep) {
        
    }
};