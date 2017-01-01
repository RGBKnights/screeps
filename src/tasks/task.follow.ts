/// <reference path="../../typings/index.d.ts" />
/**
 * The long description of the file's purpose goes here and
 * describes in detail the complete functionality of the file.
 * This description can span several lines and ends with a period.
 */

let tasks = require("tasks");
let TaskMoveRoom = require("task.move.room");

function TaskFollow (targetId, customMoveToFunction, functionModule) {
    this.taskType = "follow";
    this.conflicts = "move";
    this.targetId = targetId;
    this.customMoveToFunction = customMoveToFunction;
    this.functionModule = functionModule;
    this.heal = true;
    this.loop = true;
    this.pickup = true;
}

TaskFollow.prototype.doTask = function(creep, task) {
    let target = Game.getObjectById(task.targetId) as any;
    if (!target) {
        return "finished";
    }

    if (target.room === creep.room) {
        let result;
        if (task.customMoveToFunction) {
            if(task.functionModule) {
                let fModule = require(task.functionModule);
                result = fModule[task.customMoveToFunction](creep, target);
            } else {
                result = task.customMoveToFunction(creep, target);
            }
        } else {
            result = creep.moveTo(target);
        }
    } else {
        task.roomName = target.room;
        TaskMoveRoom.prototype.doTask(creep, task);
    }
    if (creep.getActiveBodyparts(HEAL) > 0) {
        tasks.heal(creep);
    }

    return "unfinished";
};

module.exports = TaskFollow;