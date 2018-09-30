import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { IncidentModel, IncidentService } from "../../incident";
import { DepartmentClosureModel } from './department.closure.model';
import { IDepartmentClosureService } from './IDepartmentClosureService';
import { ActionableModel, ActionableService } from "../../shared.components/actionables";
import { DemandModel } from "../../shared.components/demand/components/demand.model";
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase, GlobalConstants
} from '../../../shared';


@Injectable()
export class DepartmentClosureService extends ServiceBase<DepartmentClosureModel> implements IDepartmentClosureService {
    public IsDepartmentClosureSubmit: boolean;
    private _dataServiceForDemand: DataService<DemandModel>;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private dataServiceFactory: DataServiceFactory,
        private incidentService: IncidentService,
        private actionableService: ActionableService) {
        super(dataServiceFactory, 'DepartmentClosures');
        let option: DataProcessingService = new DataProcessingService();

        this._dataServiceForDemand = this.dataServiceFactory.CreateServiceWithOptions<DemandModel>('Demands', option);
        this.IsDepartmentClosureSubmit = false;
    }

    public GetIncidentFromIncidentId(incidentId: number): Observable<IncidentModel> {
        return this.incidentService.GetIncidentById(incidentId);
    }

    public GetAllByIncident(incidentId: number): Observable<ResponseModel<DepartmentClosureModel>> {
        return this._dataService.Query()
            .Expand("Department")
            .Filter(`IncidentId eq ${incidentId}`)
            .Execute();
    }
    public GetAllByIncidentDepartment(incidentId: number, departmentId: number): Observable<ResponseModel<DepartmentClosureModel>> {
        return this._dataService.Query()
            .Expand("Department")
            .Filter(`IncidentId eq ${incidentId} and DepartmentId eq ${departmentId}`)
            .Execute();
    }

    public getAllbyIncidentandDepartment(incidentId, departmentId): Observable<ResponseModel<DepartmentClosureModel>> {
        return this._dataService.Query()
            .Select('ClosureReport,ClosureRemark')
            .Filter(`IncidentId eq ${incidentId}  and DepartmentId eq ${departmentId}`)
            .Execute();
    }

    public CreateDepartmentClosure(departmentClosure: DepartmentClosureModel): Observable<DepartmentClosureModel> {
        return this._dataService.Post(departmentClosure)
            .Execute();
    }

    public UpdateDepartmentClosure(entity: DepartmentClosureModel): Observable<DepartmentClosureModel> {
        let key: string = entity.DepartmentClosureId.toString()
        return this._dataService.Patch(entity, key)
            .Execute();
    }

    public CheckPendingCheckListOrDemandForIncidentAndDepartment(incidentId: number, departmentId: number,
        notifyCallback?: ((_: boolean) => void)): void {
        this.actionableService.GetPendingOpenActionableForIncidentAndDepartment(incidentId, departmentId)
            .map((actionables: ResponseModel<ActionableModel>) => {
                this.IsDepartmentClosureSubmit = (actionables.Records.length > 0);
            })
            .flatMap((x) => this._dataServiceForDemand.Query()
                .Filter(`IncidentId eq ${incidentId} and TargetDepartmentId eq ${departmentId} and IsCompleted ne true`)
                .Execute())
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((demands: ResponseModel<DemandModel>) => {
                if (this.IsDepartmentClosureSubmit == false) {
                    if (notifyCallback) {
                        if (demands.Records.length > 0) {
                            // If any of the assigned demand is not approved or rejected then the specific demand will not be considered as open.
                            // which allow the user to process the callback instead of showing notification.
                            const isAnyOpenDemandExists: boolean = demands.Records.some((x: DemandModel) => (x.IsApproved && !x.IsClosed) || !x.IsRejected);
                            notifyCallback(isAnyOpenDemandExists);
                        } else {
                            notifyCallback(false);
                        }
                    }
                }
                else {
                    if (notifyCallback) {
                        notifyCallback(true);
                    }
                }
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }
}
