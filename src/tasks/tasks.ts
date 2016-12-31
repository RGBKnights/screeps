/// <reference path="../../typings/index.d.ts" />
/**
 * The long description of the file's purpose goes here and
 * describes in detail the complete functionality of the file.
 * This description can span several lines and ends with a period.
 */

let tasks = {
    getTargetId: function (creep) {
        return creep.memory.tasks.targetId;
    },
    setTargetId: function (creep, targetId) {
        if (undefined === targetId) {
            creep.memory.tasks.targetId = undefined
        } else if (typeof targetId == "string") {
            creep.memory.tasks.targetId = targetId;
        } else {
            creep.memory.tasks.targetId = targetId.id;
        }
    }
};

module.exports = tasks;