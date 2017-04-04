// import { Injectable } from '@angular/core';

// import { SideMenuService, KeyValue, ResponseModel } from '../shared';
// import { DepartmentService, DepartmentModel } from './masterdata';
// import { IncidentService, IncidentModel } from './incident';

// @Injectable()
// export class PageService {

//     constructor(private incidentService: IncidentService,
//         private departmentService: DepartmentService) { }

//     public GetDepartments(): KeyValue[] {
//         this.departmentService.GetAll()
//             .map((x: ResponseModel<DepartmentModel>) => x.Records.sort((a, b) => {
//                 if (a.DepartmentName < b.DepartmentName) return -1;
//                 if (a.DepartmentName > b.DepartmentName) return 1;
//                 return 0;
//             })).subscribe((x: DepartmentModel[]) => {
//                 x.map((y: DepartmentModel) => new KeyValue(y.DepartmentName, y.DepartmentId))
//             })
//     }
// }