/// <reference path="../typings/index.d.ts" />
"use strict";

// let woker = require("hive.worker");

function freeMemory() {
    for(let i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}

enum RoomAllegiance {
    Neutral = 0,
    Frendly,
    Hostile
}

function determineRoomAllegiance(room:Room) {
    if(room.controller) {
        if(room.controller.my) {
            room.memory.allegiance = RoomAllegiance.Frendly;
        } else {
            room.memory.allegiance = RoomAllegiance.Hostile;
        }
    } else {
        room.memory.allegiance = RoomAllegiance.Neutral;
    }
}

function determineRoomThreatLevel(room:Room) {
    // + No Threat
    // ~0 evenly matched
    // - We are all going to die~!

    let friendlyStrenght = 0;
    {
        let creeps = room.find(FIND_MY_CREEPS);
        let potential = _.map(, (creep:Creep) =>  creep.getActiveBodyparts(ATTACK).length + creep.getActiveBodyparts(RANGED_ATTACK).length);
        friendlyStrenght += _.sum(potential);
    }
    {
        let towers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        let potential = _.map(towers, (tower:StructureTower) => 5);
        friendlyStrenght += _.sum(potential);
    }

    let hostileStrenght = 0;
    {
        let creeps = room.find(FIND_HOSTILE_CREEPS);
        let potential = _.map(creeps, (creep:Creep) =>  creep.getActiveBodyparts(ATTACK).length + creep.getActiveBodyparts(RANGED_ATTACK).length);
        hostileStrenght += _.sum(potential);
    }
    {
        let towers = room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        let potential = _.map(towers, (tower:StructureTower) => 10);
        hostileStrenght += _.sum(potential);
    }

    room.memory.threat = (friendlyStrenght - hostileStrenght);
} 

function updateRoomsMemory(room:Room) {
    if((room.memory.lastProcesedTick + 100) == Game.time) {
        room.memory.lastProcesedTick = Game.time;

        determineRoomAllegiance(room);
        determineRoomThreatLevel(room);
    }
}

function processRoom(room:Room) {
    updateRoomsMemory(room);
}

module.exports = {
    loop: function() {
        freeMemory();

        Game.rooms.forEach(room => {
            processRoom(room);
        });

    }
};