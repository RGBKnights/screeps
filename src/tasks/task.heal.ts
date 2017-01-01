/// <reference path="../../typings/index.d.ts" />
/**
 * The long description of the file's purpose goes here and
 * describes in detail the complete functionality of the file.
 * This description can span several lines and ends with a period.
 */

let tasks = require("tasks");

function TaskHeal () {
    this.taskType = "heal";
    this.conflicts = "heal";
    this.pickup = false;
    this.loop = true;
}

TaskHeal.prototype.doTask = function(creep, task) {
    let target;
    target = tasks.getTargetId(creep);
    if (!target) {
        target = creep.pos.findInRange(FIND_MY_CREEPS, "heal", function (c) {
            return c.hits < c.hitsMax;
        });
    }
    if (target) {
        creep.heal(target);
    }

    return "finished";
};

module.exports = TaskHeal;