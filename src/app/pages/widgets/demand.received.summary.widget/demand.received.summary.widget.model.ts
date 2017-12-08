import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';
import { DemandModel } from '../../shared.components/demand';

export class DemandReceivedSummaryModel {
    public demandAllocatedCount: number;
    public demandCompletedCount: number;

    constructor() {
        this.demandAllocatedCount = 0;
        this.demandCompletedCount = 0;
    }
}



export class DemandReceivedModel {
    public demandModelList: DemandModel[];
    public departmentId: number;
    public targetDepartmentName: string;
    public assigned: number;
    public completed: number;
    public pending: number;

    constructor() {
        this.demandModelList = [];
        this.departmentId = 0;
        this.targetDepartmentName = '';
        this.assigned = 0;
        this.completed = 0;
        this.pending = 0;
    }
}

export class AllDeptDemandReceivedSummary extends DemandModel {
    public description: string;
    public requesterDepartmentName: string;
    public scheduleCloseTime: Date;
    public RagStatus: string;

    constructor() {
        super();
        this.description = '';
        this.requesterDepartmentName = '';
        this.RagStatus = '';
    }
}

export class SubDeptDemandReceivedSummary extends DemandModel {
    public description: string;
    public requesterDepartmentName: string;
    public scheduleCloseTime: Date;
    public RagStatus: string;

    constructor() {
        super();
        this.description = '';
        this.requesterDepartmentName = '';
        this.RagStatus = '';
    }
}