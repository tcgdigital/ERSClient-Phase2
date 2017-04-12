import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';
import { DemandModel } from '../../shared.components/demand';

export class DemandRaisedSummaryModel {
    public demandRaisedCount: number;
    public demandClosedCount: number;

    constructor() {
        this.demandRaisedCount = 0;
        this.demandClosedCount = 0;
    }
}

export class DemandRaisedModel {
    public demandModelList: DemandModel[];
    public departmentId: number;
    public targetDepartmentName: string;
    public assigned: number;
    public completed: number;
    public pending: number;

    constructor() {
        //this.actionableModelList = [];
        this.departmentId = 0;
        this.targetDepartmentName = '';
        this.assigned = 0;
        this.completed = 0;
        this.pending = 0;
    }
}

export class AllDemandRaisedSummaryModel extends DemandModel {
    public description: string;
    public requesterDepartment: string;
    public scheduleCloseTime: number;
    public RagStatus: string;
    public status: string;

    constructor() {
        super();
        this.description = '';
        this.requesterDepartment = '';
        this.scheduleCloseTime = 0;
        this.RagStatus = '';
        this.status = '';
    }
}

export class AllDeptDemandRaisedSummary extends  DemandModel {
    public description: string;
    public requesterDepartmentName: string;
    public scheduleCloseTime: Date;
    public RagStatus: string;
}

export class SubDeptDemandRaisedSummary extends  DemandModel {
    public description: string;
    public requesterDepartmentName: string;
    public scheduleCloseTime: Date;
    public RagStatus: string;
}