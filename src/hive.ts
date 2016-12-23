/// <reference path="../typings/index.d.ts" />
"use strict";

let roleWorker = require("hive.role.worker");
let roleHauler = require("hive.role.hauler");
let roleMinner = require("hive.role.minner");
let roleUpgrader = require("hive.role.upgrader");
let roleBuidler = require("hive.role.builder");
let roleArtillery = require("hive.role.artillery");
let roleMedic = require("hive.role.medic");

function proccessRoom(room:Room, roles:any) {
    let friendlies = room.find(FIND_MY_CREEPS);
    let hostiles = room.find(FIND_HOSTILE_CREEPS);
    let spawns = room.find(FIND_MY_SPAWNS);
    let sources = room.find(FIND_SOURCES);

    for (let key in roles) {
        if (roles.hasOwnProperty(key)) {
            let role = roles[key];
            let count = 0;

            for (let name in friendlies) {
                if (friendlies.hasOwnProperty(name)) {
                    let creep = friendlies[name];
                    if(creep.memory.role === role.getName()) {
                        count++;
                        role.run(creep);
                    }
                }
            }

            if(spawns.length > 0) {
                let creep = role.spawnUnitIfNeeded(room, count, spawns, sources, friendlies, hostiles);
                if(creep) {
                    role.run(creep);
                }
            }

        }
    }
};

function freeMemory() {
    for(let i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
};

module.exports = {

    loop: function() {
        freeMemory();

        let roles = {
            worker: roleWorker,
            minner: roleMinner,
            hauler: roleHauler,
            upgrader: roleUpgrader,
            buidler: roleBuidler
            // artillery: roleArtillery,
            // medic: roleMedic
        };

        for (let key in Game.rooms) {
            if (Game.rooms.hasOwnProperty(key)) {
                let room = Game.rooms[key];
                proccessRoom(room, roles);
            }
        }
    }
};