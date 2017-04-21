import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';

import { IncidentModel } from '../../incident';
import { DepartmentModel } from '../../masterdata/department';

export class DepartmentClosureModel extends BaseModel {
        public DepartmentClosureId : number;
        public IncidentId : number;
        public DepartmentId : number;
        public ClosureReport : string;
        public ClosureRemark : string;
        public IsSubmitted : boolean;
        public SubmittedBy ? : number;
        public  SubmittedOn ? : Date;
        public  IsSaved : boolean;
        public SavedBy ? : number;
        public  SavedOn ? : Date;

        public Incident ? : IncidentModel;
        public Department ? : DepartmentModel;
        
        constructor(){
            super();
        }
}