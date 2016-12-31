/// <reference path="../typings/index.d.ts" />
"use strict";

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
    let towers = room.find(FIND_STRUCTURES, { filter: (structure) => structure.structureType === STRUCTURE_TOWER });
    if(room.memory.threat < 0) {
        // Overwhelmed... Attack!
        _.forEach(towers, (tower: StructureTower) => {
            let closest = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closest) {
                tower.attack(closest);
            }
        });
    } else {
        // Suport..
        _.forEach(towers, (tower: StructureTower, key)  => {
            if(key % 2 === 0) {
                let closest = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if(closest) {
                    tower.repair(closest);
                }
            } else {
                let closest = tower.pos.findClosestByRange(FIND_MY_CREEPS);
                if(closest) {
                    tower.heal(closest);
                }
            }

        });
    }
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


function freeMemory() {
    for(let i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}

module.exports = {
    loop: function() {
        freeMemory();

        _.forEach(Game.rooms, (room: Room) => processRoom(room));
    }
};