/// <reference path="../../typings/index.d.ts" />
/**
 * The long description of the file's purpose goes here and
 * describes in detail the complete functionality of the file.
 * This description can span several lines and ends with a period.
 */

import * as _tasks from "./tasks";

function TaskActionTarget (action) {
    this.taskType = "action.target";
    this.action = action;
    this.conflicts = action;
}

TaskActionTarget.prototype.doTask = function(creep, task) {
    let tasks = new _tasks.TaskHelper();
    let target =  Game.getObjectById(tasks.getTargetId(creep));
    if (!target) {
        return "finished";
    }
    let rtv = creep[task.action](target);
    if (rtv === OK) {
        return "finished";
    } else {
        return "rollback";
    }

};

module.exports = TaskActionTarget;