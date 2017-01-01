/// <reference path="../../typings/index.d.ts" />
/**
 * The long description of the file's purpose goes here and
 * describes in detail the complete functionality of the file.
 * This description can span several lines and ends with a period.
 */

let tasks = require("tasks");

function TaskMoveFind (
    findMethod,
    range,
    method ,
    findModule,
    moveToOpts,
    findId,
    customMoveToFunction,
    functionModule
) {
    this.taskType = "move.find";
    this.conflicts = "move";
    this.method = findMethod;
    this.findId = method;
    if (undefined !== findId) {
        this.findId = findId;
    }
    this.findObject = method;
    this.findStructure = method;
    this.findFilter = method;
    this.findFunction = method;
    this.findModule = findModule;
    if (undefined === range) {
        range =1;
    } else {
        this.range = range;
    }
    this.moveToOpts = moveToOpts;
    this.customMoveToFunction = customMoveToFunction;
    this.functionModule = functionModule;
    this.rembemerTarget = undefined;
    this.findList = undefined;
    this.heal = true;
    this.loop = true;
    this.pickup = true;
}

TaskMoveFind.prototype.FindMethod = {
    FindId: "find.id",
    FindRoomObject: "find.object",
    FindStructure: "structure.id",
    FindFilter: "filter.function",
    FindFunction: "find.function"
};

TaskMoveFind.prototype.doTask = function(creep, task) {
    let target = undefined;
    if (tasks.getTargetId(creep)) {
        target = Game.getObjectById(tasks.getTargetId(creep));
    } else {
        tasks.setTargetId(creep, undefined);
    }
    if (!target) {

        switch (task.method) {
            case this.FindMethod.FindId:
                target = Game.getObjectById(task.findId);
                // Siwtch to backup plan
                if (!target && task.findModule && task.findFunction) {
                    let module = require(task.findModule);
                    target = module[task.findFunction](creep);
                    if (target) {
                        tasks.setTargetId(creep, target.id);
                    }
                }
                break;
            case this.FindMethod.FindRoomObject:
                target = creep.pos.findClosestByRange(task.findObject);
                break;
            case this.FindMethod.FindStructure:
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: {structureType: task.findStructure}});
                break;
            case this.FindMethod.FindFilter:
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: task.findFilter});
                break;
            case this.FindMethod.FindFunction:
                let module = require(task.findModule);
                target = module[task.findFunction](creep, task.findList);
                break;
            default:
                // Unreachable
        }

        if (target) {
            tasks.setTargetId(creep, target.id);
        }
    }
    if (!target) {
        // creep.say("No target");
        return "finished";
    }

    let distanceToGo = creep.pos.getRangeTo(target);
    if (distanceToGo <= task.range) {
        //  creep.say("there");
        return "finished";
    }

    let result;
    if (task.customMoveToFunction) {
        if(  task.functionModule) {
            let fModule = require(task.functionModule);
            if (typeof fModule[task.customMoveToFunction] === "function" ) {
                result = fModule[task.customMoveToFunction](creep, target);
            }
        } else {
            result = task.customMoveToFunction(creep, target);
        }
    } else {
        result = creep.moveTo(target, { reusePath: 10 } );
    }

    distanceToGo = creep.pos.getRangeTo(target);
    if (distanceToGo <= task.range) {
        // creep.say("There");
        return "finished";
    }  else {
        creep.say(result);
        switch (result) {
            case OK:                        // 0	The operation has been scheduled successfully.
            case ERR_TIRED:                 // -11	The fatigue indicator of the creep is non-zero.
                return "unfinished";
            case ERR_INVALID_TARGET:        // -7	The target provided is invalid.
            case ERR_NO_PATH:               // -2	No path to the target could be found.
                return "rollback";
            case ERR_NOT_OWNER:             // -1	You are not the owner of this creep.
            case ERR_BUSY:                  // -4	The creep is still being spawned.
            case ERR_NO_BODYPART:           // -12	There are no MOVE body parts in this creep’s body.
            default:
                return "finished";
        }
    }
};

module.exports = TaskMoveFind;
