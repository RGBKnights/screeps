/// <reference path="../typings/index.d.ts" />
"use strict";

let roleWorker = require("hive.role.worker");
let roleHauler = require("hive.role.hauler");
let roleMinner = require("hive.role.minner");
let roleUpgrader = require("hive.role.upgrader");

function proccessRoom(room:Room, roles:any) {
    let creeps = room.find(FIND_MY_CREEPS);
    let spawns = room.find(FIND_MY_SPAWNS);
    let sources = room.find(FIND_SOURCES);

    room.memory.totals = {
        creeps: creeps.length,
        spawns: spawns.length,
        sources: sources.length
    };

    for (let key in roles) {
        if (roles.hasOwnProperty(key)) {
            let role = roles[key];
            let count = 0;

            for (let name in creeps) {
                if (creeps.hasOwnProperty(name)) {
                    let creep = creeps[name];
                    if(creep.memory.role === role.handler.getName()) {
                        count++;
                        role.handler.run(creep);
                    }
                }
            }

            if(role.shouldSpawn(room, count)) {
                let spawn = _.first(spawns);
                if(spawn) {
                    let body = role.getBody();
                    let result = spawn.canCreateCreep(body, null);
                    if(result === OK) {
                        spawn.createCreep(body, null, { role: role.getName() });
                    }
                }
            }
        }
    }
}

module.exports = {
    freeMemory: function() {
        for(let i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
    },
    processWorkers: function() {
        let roles = {
            worker: roleWorker,
            minner: roleMinner,
            hauler: roleHauler,
            upgrader: roleUpgrader
        };

        for (let key in Game.rooms) {
            if (Game.rooms.hasOwnProperty(key)) {
                let room = Game.rooms[key];
                proccessRoom(room, roles);
            }
        }
    }
};