/// <reference path="../../typings/index.d.ts" />
/**
 * The long description of the file's purpose goes here and
 * describes in detail the complete functionality of the file.
 * This description can span several lines and ends with a period.
 */

let TaskMoveXY = require("task.move.xy");
let TaskMoveRoom = require("task.move.room");

function TaskMovePos (roomPos, range, pathOps, customMoveToFunction, functionModule, finsihCondition, finishModule) {
    this.taskType = "move.pos";
    this.conflicts = "move";
    this.roomPos = roomPos;
    if (range === undefined) {
        this.range = 0;
    } else {
        this.range =range;
    }
    this.pathOps = pathOps;
    this.customMoveToFunction = customMoveToFunction;
    this.functionModule = functionModule;
    this.finsihCondition = finsihCondition;
    this.finishModule = finishModule;
    this.heal = true;
    this.loop = true;
    this.pickup = true;
}

TaskMovePos.prototype.doTask = function(creep, task) {
    if (task.finsihCondition) {
        let module = require(task.finishModule);
        let rtv = module[task.finsihCondition](creep);
        if (rtv) {
            return rtv;
        }
    }
    if (task.startRoom === undefined) {
        // First call to function. Initialise data.
        task.startRoom = creep.room.name;
        if (undefined === task.roomPos) {
            console.log(creep,"position undefined in TaskMovePos");
            return "finished";
        }
        task.roomName = task.roomPos.roomName; // ToDP error
        task.x = task.roomPos.x;
        task.y = task.roomPos.y;
        task.pathIndex = 0;
    }
    if (undefined === task.roomPos) {
        return "finished";
    }

    task.roomName = task.roomPos.roomName;
    if (creep.room.name === task.roomPos.roomName && !TaskMoveRoom.prototype.atBorder(creep.pos.x,creep.pos.y)) {
        return TaskMoveXY.prototype.doTask(creep, task);
    }
    TaskMoveRoom.prototype.doTask(creep, task, task.customMoveToFunction, task.functionModule);
    return "unfinished";
};

module.exports = TaskMovePos;

