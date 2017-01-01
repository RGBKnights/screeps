/// <reference path="../../typings/index.d.ts" />
/**
 * The long description of the file's purpose goes here and
 * describes in detail the complete functionality of the file.
 * This description can span several lines and ends with a period.
 */

function TaskMoveRoom (roomName, pathOps, customMoveToFunction, functionModule, finsihCondition, finishModule) {
    this.taskType = "move.room";
    this.conflicts = "move";
    this.roomName = roomName;
    this.pathOps = pathOps;
    this.loop = true;
    this.pickup = true;
    this.customMoveToFunction = customMoveToFunction;
    this.functionModule = functionModule;
    this.finsihCondition = finsihCondition;
    this.finishModule = finishModule;
    this.heal = true;
}

TaskMoveRoom.prototype.doTask = function(creep, task) {
    if (!task.roomName) {
        return "unfinished";
    }
    if (task.finsihCondition) {
        let module = require(task.finishModule);
        let rtv = module[task.finsihCondition](creep);
        if (rtv) {
            return rtv;
        }
    }

    if (task.startRoom === undefined || task.roomsToVisit === ERR_NO_PATH) {
        // First call to function. Initialise data.
        task.startRoom = creep.room.name;
        task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomName, task.pathOps);
        task.pathIndex = 0;
    }
    if (creep.room.name === task.roomName && !this.atBorder(creep.pos.x,creep.pos.y)) {
        return "finished";
    }

    if ( task.roomsToVisit === undefined || task.pathIndex >= task.roomsToVisit.length ) { 
        // We are lost. Recalculate route.
        task.startRoom = creep.room.name;
        task.roomsToVisit = Game.map.findRoute(task.startRoom, task.roomName, task.pathOps);
        task.pathIndex = 0;
        return "unfinished";
    }

    if (task.roomsToVisit === ERR_NO_PATH) {
        return "unfinished";
    }

    if ( this.atBorder(creep.pos.x,creep.pos.y ) ) {
        let targetRoom = task.roomsToVisit[task.pathIndex].room;
        let nextStepD = this.nextStepIntoRoom(creep.pos, targetRoom);
        let result = creep.move(nextStepD);
        if (OK === result) {
            task.pathIndex++;
            if (targetRoom = creep.room) {
                creep.memory.tasks.newRoom = targetRoom;
            }
        }
        return "unfinished";
    }

    if ( task.roomsToVisit[task.pathIndex] !== undefined) {
        let result = null;
        let exit = creep.pos.findClosestByPath(task.roomsToVisit[task.pathIndex].exit);
        if (task.customMoveToFunction) {
            if(task.functionModule) {
                let fModule = require(task.functionModule);
                result = fModule[task.customMoveToFunction](creep, exit);
            } else {
                result = task.customMoveToFunction(creep, exit);
            }
        } else {
            result = creep.moveTo(exit);
        }
    } else {
        return "finished";
    }

    return "unfinished";

};

TaskMoveRoom.prototype.atBorder = function(x,y) {
    return ( x === 0 || x === 49 || y === 0 || y === 49 )
};

TaskMoveRoom.prototype.nearBorder = function(x,y) {
    let r = 2;
    return ( x <= 0 + r || x >= 49 - r || y <= 0 + r  || y >= 49 - r )
};

TaskMoveRoom.prototype.nextStepIntoRoom = function(pos, nextRoom) {
    let x = pos.x;
    let y = pos.y;
    let direction;
    if (pos.x === 0) {
        direction = RIGHT;
    }
    if (pos.x === 49) {
        direction = LEFT ;
    }
    if (pos.y === 0) {
        direction = BOTTOM;
    }
    if (pos.y === 49) {
        direction = TOP;
    }
    return direction;
};

TaskMoveRoom.prototype.moveTowardsCenter = function (pos) {
    let room = Game.rooms[pos.roomName];
    let xNextPos, xNextMove,yNextPos,yNextMove;
    if ( pos.x < 25) {
        xNextMove = RIGHT;
        xNextPos = 1;
    } else {
        xNextMove = LEFT;
        xNextPos = -1;
    }

    if ( pos.y < 25) {
        yNextMove = BOTTOM;
        yNextPos = 1;
    } else {
        yNextMove = TOP;
        yNextPos = -1;
    }

    let diaganal = new RoomPosition(pos+xNextMove,pos+yNextMove, room.name);
}

module.exports = TaskMoveRoom;