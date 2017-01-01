/// <reference path="../../typings/index.d.ts" />
/**
 * The long description of the file's purpose goes here and
 * describes in detail the complete functionality of the file.
 * This description can span several lines and ends with a period.
 */

let tasks = require("tasks");

function TaskHarvest (sourceId) {
    this.taskType = "harvest";
    this.conflicts = "harvest";
    this.sourceId = sourceId;
    this.pickup = true;
    this.loop = true;
    this.waitForRespawn = false;
    this.defensive = false;
}

TaskHarvest.prototype.doTask = function(creep, task) {
    if (task.defensiveRetreat) {
        if (tasks.defensiveRetreat(creep)) {
            return "rollback";
        }
    }

    if (_.sum(creep.carry) === creep.carryCapacity)  {
        tasks.setTargetId(creep, undefined);
        return "finished";
    }

    let source;
    if (task.sourceId) {
        source = Game.getObjectById(task.sourceId);
    }
    if (!source) {
        source =  Game.getObjectById(tasks.getTargetId(creep));
    }
    if (!source) {
        if (_.sum(creep.carry) === creep.carryCapacity) {
            return "finished";
        }  else {
            return "rollback";
        }
    }

    let rtv = creep.harvest(source);
    switch (rtv) {
        case    OK:                             // 0	The operation has been scheduled successfully.;
            if (_.sum(creep.carry) === creep.carryCapacity) {
                tasks.setTargetId(creep, undefined);
                return "finished";
            }  else {
                return "unfinished";
            }
        case    ERR_NOT_ENOUGH_RESOURCES:       // -6	The target source does not contain any harvestable energy.
            if (_.sum(creep.carry) === 0) {
                return "unfinished";
            }  else {
                if (_.sum(creep.carry) === creep.carryCapacity || !this.waitForRespawn) {
                    tasks.setTargetId(creep, undefined);
                    return "finished";
                } else {
                    return "unfinished";
                }

            }
        case    ERR_NOT_IN_RANGE:               // -9	The target is too far away.
        case    ERR_NOT_FOUND:                  // -5	Extractor not found. You must build an extractor structure to
                                                // harvest minerals. Learn more
        case    ERR_INVALID_TARGET:             // -7	The target is not a valid source object.
            return "finished";
        case    ERR_NOT_OWNER:                  // -1	You are not the owner of this creep, or the room controller is
                                                // owned or reserved by another player.
        case    ERR_BUSY:                       // -4	The creep is still being spawned.
        case    ERR_NO_BODYPART:	            // -12	There are no WORK body parts in this creep’s body.
        case ERR_TIRED:
            if (!creep.memory.harvestCount) {
                creep.memory.harvestCount = 0;
            } else {
                creep.memory.harvestCount += 1;
            }
            if (creep.memory.harvestCount < 5 && creep.ticksToLive > 50) {
                return "unfinished";
            } else {
                delete creep.memory.harvestCount;
                return "finished";
            }
        default:
            return "finished";

    }
};

module.exports = TaskHarvest;