/// <reference path="../../typings/index.d.ts" />
/**
 * The long description of the file's purpose goes here and
 * describes in detail the complete functionality of the file.
 * This description can span several lines and ends with a period.
 */

export class TaskHelper {
    public getTargetId(creep) {
        return creep.memory.tasks.targetId;
    }
    public setTargetId(creep, targetId) {
        if (undefined === targetId) {
            creep.memory.tasks.targetId = undefined;
        } else if (typeof targetId === "string") {
            creep.memory.tasks.targetId = targetId;
        } else {
            creep.memory.tasks.targetId = targetId.id;
        }
    }
};