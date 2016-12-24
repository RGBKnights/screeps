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
        let potential = _.map(creeps, (creep:Creep) =>  creep.getActiveBodyparts(ATTACK) + creep.getActiveBodyparts(RANGED_ATTACK));
        friendlyStrenght += _.sum(potential);
    }
    {
        let towers = room.find(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType === STRUCTURE_TOWER });
        let potential = _.map(towers, (tower:StructureTower) => 5);
        friendlyStrenght += _.sum(potential);
    }

    let hostileStrenght = 0;
    {
        let creeps = room.find(FIND_HOSTILE_CREEPS);
        let potential = _.map(creeps, (creep:Creep) =>  creep.getActiveBodyparts(ATTACK) + creep.getActiveBodyparts(RANGED_ATTACK));
        hostileStrenght += _.sum(potential);
    }
    {
        let towers = room.find(FIND_HOSTILE_STRUCTURES, { filter: (structure) => structure.structureType === STRUCTURE_TOWER });
        let potential = _.map(towers, (tower:StructureTower) => 10);
        hostileStrenght += _.sum(potential);
    }

    room.memory.threat = (friendlyStrenght - hostileStrenght);
}

function updateRoomMemory(room:Room) {
    if((room.memory.lastProcesedTick + 100) === Game.time) {
        room.memory.lastProcesedTick = Game.time;

        determineRoomAllegiance(room);
        determineRoomThreatLevel(room);
    }
}

function processUnits(room:Room) {
    // process units in room
}

function processTowers(room:Room) {
    // process towers in room
}

function constructBuildings(room:Room) {
    // create construction sites

    // [Spawn / Extension] + [Container / Storage]
    // Rampart / Walls
    // [Extractor / Lab] + [Storage / Container]
}

function constructUnits(room:Room) {
    // create units - Workers

    // create units - Scouts
}

function processRoom(room:Room) {
    updateRoomMemory(room);

    processUnits(room);
    processTowers(room);

    constructBuildings(room);
    constructUnits(room);
}

module.exports = {
    loop: function() {
        freeMemory();

        _.forEach(Game.rooms, (room: Room) => processRoom(room));

    }
};