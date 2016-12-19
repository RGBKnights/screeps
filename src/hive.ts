/// <reference path="../typings/index.d.ts" />
"use strict";

// let woker = require("bee.worker");

module.exports = {

    freeMemory: function() {
        // Creep Memory
        for(let i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
        
        // Room Memory?
        /*
        for(let i in Memory.rooms) {
            if(!Game.rooms[i]) {
                delete Memory.rooms[i];
            }
        }
        */
    },
    loop: function() {

    }
};