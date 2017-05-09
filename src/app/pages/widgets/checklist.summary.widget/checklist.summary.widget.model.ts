import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';
import { ActionableModel } from '../../shared.components/actionables/components/actionable.model';
import { DemandModel } from '../../shared.components/demand';

export class CheckListSummeryModel {
    public assignActionableCount: number;
    public closeActionableCount: number;

    constructor() {
        this.assignActionableCount = 0;
        this.closeActionableCount = 0;
    }
}

export class DeptCheckListModel {
    public actionableModelList: ActionableModel[];
    public departmentId: number;
    public departmentName: string;
    public assigned: number;
    public completed: number;
    public pending: number;

    constructor() {
        this.actionableModelList = [];
        this.departmentId = 0;
        this.departmentName = '';
        this.assigned = 0;
        this.completed = 0;
        this.pending = 0;
    }
}

export class SubDeptCheckListModel {
    public checkListDesc: string;
    public scheduleCloseTime: Date;
    public RAG: string;
    public AssignedDt: Date;
    public Duration: number;

    constructor() {
        this.checkListDesc = '';
        this.scheduleCloseTime = new Date();
        this.RAG = '';
        this.AssignedDt = new Date();
        this.Duration = 0;
    }
}


export class AllDeptDemandReceivedSummary extends  DemandModel {
    public description: string;
    public targetDepartmentName: string;
    public scheduleCloseTime: Date;
    public RagStatus: string;
}

export class SubDeptDemandReceivedSummary extends  DemandModel {
    public description: string;
    public targetDepartmentName: string;
    public scheduleCloseTime: Date;
    public RagStatus: string;
}