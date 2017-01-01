/// <reference path="../../typings/index.d.ts" />
/**
 * The long description of the file's purpose goes here and
 * describes in detail the complete functionality of the file.
 * This description can span several lines and ends with a period.
 */

function TaskAttackTarget (findTargetFunction, moduelName) {
    this.taskType = "attack.target";
    this.conflicts = "attack";
    this.moduelName = moduelName;
    this.findTarget = findTargetFunction;
    if (undefined === this.findTarget) {
        this.findTarget = function(creep) {
            return creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        };
    }
    this.pickup = false;
    this.loop = true;
}

TaskAttackTarget.prototype.doTask = function(creep, task) {
    let target;
    if (module !== undefined) {
        module = require(task.moduelName);
        if (typeof module[task.findTarget] !== "function") {
            target =  creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        } else {
            target =  module[task.findTarget] (creep);
        }
    } else {
        target =  creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    }

    if (!target) {
        return "unfinished";
    }

    switch (creep.attack(target)) {
        case OK:	                // 0	The operation has been scheduled successfully.
            return "unfinished";    // THUMP! take that!
        case ERR_NOT_IN_RANGE:	    // -9	The target is too far away.
            return "finished";      // Probably run away, coward!
        case ERR_INVALID_TARGET:	// -7	The target is not a valid attackable object.
            this.loop = false;
            return "finished";      // Probably I killed it. Hurrah!
        case ERR_NOT_OWNER:	        // -1	You are not the owner of this creep.
        case ERR_BUSY:	            // -4	The creep is still being spawned.
        case ERR_NO_BODYPART:	    // -12	There are no ATTACK body parts in this creep’s body.
        default:
            return "rollback";      // Huh!
    }
};

module.exports = TaskAttackTarget;