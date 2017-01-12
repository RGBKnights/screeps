"use strict";
/**
 * Any code written outside the `loop()` method is executed only when the
 * application loads. Use this bootstrap wisely. 
 * You can cache some of your stuff to save CPU.
 * You should extend prototypes before the game loop executes here.
 */


/**
 * Screeps system expects this "loop" method in main.js to run the
 * application. If we have this line, we can be sure that the global are
 * bootstrapped properly and the game loop is executed.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 */

function setup() {
    /*
    * Specify whether to use this new experimental pathfinder in game objects methods. 
    * This method should be invoked every tick. It affects the following methods behavior: 
    * Room.findPath, RoomPosition.findPathTo, RoomPosition.findClosestByPath, Creep.moveTo
    * http://support.screeps.com/hc/en-us/articles/207023879
    */

    PathFinder.use(true);
}

function freeMemory() {
    /*
    * Removes creeps from memory that are no longer living.
    * http://support.screeps.com/hc/en-us/community/posts/201107272-Small-snippet-to-clear-the-memory-of-dead-creeps-
    */

    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}

exports.loop = function () {
    // Test: caterpillar movement system 
    // [
    //  WORK(only at the ends?[how to get there?]),
    //  CARRY(links in chain), 
    //  MOVE(needed? how much?)
    // ]

    setup();

    freeMemory();

    for (var i in Game.rooms) {
        var room = Game.rooms[i];
        if (room.controller.my) {
            if (!room.memory.processed) {
                var spawns = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });
                var sources = room.find(FIND_SOURCES);

                var pathNest = room.findPath(spawns[0].pos, sources[1].pos);
                pathNest.pop();
                pathNest.shift();

                for (var i in pathNest) {
                    var step = pathNest[i];
                    room.createFlag(step.x, step.y, i, COLOR_RED);
                }

                var pathNest = room.findPath(room.controller.pos, sources[0].pos);
                pathNest.pop();
                pathNest.shift();

                for (var i in pathNest) {
                    var step = pathNest[i];
                    room.createFlag(step.x, step.y, i, COLOR_BLUE);
                }

                room.memory.processed = true;
            }
        }
    }
};
