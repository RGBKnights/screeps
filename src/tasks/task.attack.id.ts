/// <reference path="../../typings/index.d.ts" />
/**
 * The long description of the file's purpose goes here and
 * describes in detail the complete functionality of the file.
 * This description can span several lines and ends with a period.
 */

let tasks = require("tasks");

function TaskAttackId (targetId) {
    this.taskType = "attack.id";
    this.conflicts = "attack";
    this.targetId = targetId;
    this.pickup = false;
    this.loop = true;
}

TaskAttackId.prototype.doTask = function(creep, task) {
    let target;
    if (undefined === task.targetId) {
        target = Game.getObjectById(tasks.getTargetId(creep));
    } else {
        target = Game.getObjectById(task.targetId);
    }
    creep.rangedAttack(target);
    if (!creep.pos.isNearTo(target)) {
        tasks.attackClosest(creep);
    }
    let result = creep.attack(target);
    switch (result) {
        case OK:	                        // 0	The operation has been scheduled successfully.
            // creep.say("Thump!");
            return "unfinished";            // THUMP! take that!
        case ERR_NOT_IN_RANGE:	            // -9	The target is too far away.
            // creep.say("coward");
            return "rollback";              // Move closer.
        case ERR_INVALID_TARGET:	        // -7	The target is not a valid attackable object.
            this.loop = false;
            tasks.setTargetId(creep, undefined);
            // creep.say("Gotya!");
            return "finished";              // Probably I killed it. Hurrah!
        case ERR_NOT_OWNER:	                // -1	You are not the owner of this creep.
        case ERR_BUSY:	                    // -4	The creep is still being spawned.
        case ERR_NO_BODYPART:	            // -12	There are no ATTACK body parts in this creep’s body.
        default:
            // creep.say("Huh!");
            return "finished";      //  Huh! Whats up!
    }
};

module.exports = TaskAttackId;