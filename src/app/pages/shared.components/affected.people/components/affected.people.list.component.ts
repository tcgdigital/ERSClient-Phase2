import { Component, ViewEncapsulation, OnInit, ViewChild, Injector } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { CommunicationLogModel, CommunicationLogService } from '../../../shared.components/communicationlogs';
import { InvolvePartyService, InvolvePartyModel } from '../../involveparties';
import { EnquiryModel } from '../../call.centre/components/call.centre.model';
import { CallerModel, CallerService } from '../../caller';
import { PassengerService, CoPassengerMappingModel, PassengerModel } from '../../passenger/components';
import { NextOfKinModel } from '../../nextofkins';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';
import { AffectedPeopleService } from './affected.people.service';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import * as jwtDecode from 'jwt-decode';
import {
    ResponseModel, DataExchangeService, GlobalConstants, AuthModel,
    GlobalStateService, UtilityService, KeyValue, FileUploadService, SearchConfigModel,
    SearchTextBox, SearchDropdown, NameValue
} from '../../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FileStoreModel } from '../../../../shared/models/file.store.model';
import { FileStoreService } from '../../../../shared/services/common.service';
import * as _ from 'underscore';

@Component({
    selector: 'affectedpeople-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.people.list.view.html'
})
export class AffectedPeopleListComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;
    @ViewChild('childModalForTrail') public childModalForTrail: ModalDirective;
    @ViewChild('childModalForCallers') public childModalForCallers: ModalDirective;
    @ViewChild('inputFileCrew') inputFileCrew: any;

    affectedPeople: AffectedPeopleToView[] = [];
    currentIncident: number;
    affectedPersonToUpdate: AffectedPeopleModel = new AffectedPeopleModel();
    IsDestroyed: boolean;
    affectedPersonModelForStatus: AffectedPeopleToView = new AffectedPeopleToView();
    medicalStatus: any[] = GlobalConstants.MedicalStatus;
    pdaNameForTrail: string = '';
    pdaReferenceNumberForTrail: string = '';
    communications: CommunicationLogModel[] = [];
    ticketNumber: string = '';
    currentDepartmentId: number;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    callers: CallerModel[] = [];
    affectedPersonModel: AffectedPeopleModel = new AffectedPeopleModel();
    nextOfKins: NextOfKinModel[] = [];
    filesToUpload: File[] = [];
    credential: AuthModel;
    date: Date;
    downloadFilePath: string;
    downloadPath: string;
    downloadRoute: string;
    copassangers: PassengerModel[] = [];
    public globalStateProxyOpen: GlobalStateService;
    searchConfigs: Array<SearchConfigModel<any>> = new Array<SearchConfigModel<any>>();
    downloadfilename: string;
    expandSearch: boolean = false;
    searchValue: string = "Expand Search";
    public isShowIsNOKInvolved: boolean = true;
    public userName: string;
    public currentDepartmentName: string;
    /**
     * Creates an instance of AffectedPeopleListComponent.
     *
     * @param {AffectedPeopleService} affectedPeopleService
     * @param {InvolvePartyService} involvedPartyService
     * @param {DataExchangeService<number>} dataExchange
     * @param {GlobalStateService} globalState
     *
     * @memberOf AffectedPeopleListComponent
     */
    constructor(private affectedPeopleService: AffectedPeopleService,
        private injector: Injector,
        private callerservice: CallerService,
        private involvedPartyService: InvolvePartyService,
        private dataExchange: DataExchangeService<number>,
        private globalState: GlobalStateService,
        private communicationLogService: CommunicationLogService,
        private _router: Router,
        private departmentService: DepartmentService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private fileUploadService: FileUploadService,
        private fileStoreService: FileStoreService,
        private passangerService: PassengerService) {
        this.downloadFilePath = GlobalConstants.EXTERNAL_URL + 'api/FileDownload/GetFile/Affected People/';
        this.globalStateProxyOpen = injector.get(GlobalStateService);
    }

    openAffectedPersonDetail(affectedPerson: AffectedPeopleToView): void {
        this.copassangers = [];
        if (affectedPerson.Crew) {
            affectedPerson.Crew.FileStores = [];
            //this.inputFileCrew.nativeElement.value = '';
        }
        if (this.inputFileCrew) {
            this.inputFileCrew.nativeElement.value = '';
        }

        this.affectedPersonModelForStatus = affectedPerson;
        if(this.affectedPersonModelForStatus.Age == "NaN")
        {
            this.affectedPersonModelForStatus.Age = "Not Available";
        }
        if(this.affectedPersonModelForStatus.Nationality.trim() == "")
        {
            this.affectedPersonModelForStatus.Nationality = "Not Available";
        }

        if (affectedPerson.MedicalStatus !== 'NA') {
            this.affectedPersonModelForStatus['MedicalStatusToshow'] = this.medicalStatus
                .find((x) => x.value === affectedPerson.MedicalStatus).value;
        }
        this.affectedPeopleService.GetCallerListForAffectedPerson(affectedPerson.AffectedPersonId)
            .subscribe((response: ResponseModel<EnquiryModel>) => {
                this.callers = response.Records.map((x) => {
                    return x.Caller;
                });
                if (affectedPerson.PassengerId !== 0 && affectedPerson.GroupId !== 0) {
                    this.passangerService.getCoPassengers(affectedPerson.GroupId)
                        .subscribe((response: ResponseModel<CoPassengerMappingModel>) => {
                            if (response.Records.length > 0) {
                                this.copassangers = _.flatten(_.pluck(response.Records, 'Passenger'));
                                this.copassangers = _.without(this.copassangers, _.findWhere(this.copassangers, { PassengerId: affectedPerson.PassengerId }));
                                this.childModal.show();
                            }
                        });
                }
                else {
                    this.childModal.show();
                }
            });
    }

    cancelModal() {
        this.childModal.hide();
    }

    getCurrentDepartmentName(departmentId): void {
        this.departmentService.Get(departmentId)
            .subscribe((response: DepartmentModel) => {
                this.currentDepartmentName = response.DepartmentName;

            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getFileDetails(e: any): void {
        this.filesToUpload = [];
        for (var i = 0; i < e.target.files.length; i++) {
            const extension = e.target.files[i].name.split('.').pop();
            if (extension !== 'exe' && extension !== 'dll')
                this.filesToUpload.push(e.target.files[i]);
            else {
                this.toastrService.error('Invalid File Format!', 'Error', this.toastrConfig);
                this.inputFileCrew.nativeElement.value = '';
            }
        }
    }

    uploadFile(): void {
        if (this.filesToUpload.length) {
            let baseUrl = GlobalConstants.EXTERNAL_URL;
            let organizationId = +UtilityService.GetFromSession('CurrentOrganizationId');
            let moduleName = 'Affected People'
            let param = `${this.currentIncident}/${organizationId}/${this.currentDepartmentId}/${moduleName}`;

            this.date = new Date();
            this.fileUploadService.uploadFiles<string>(baseUrl + './api/fileUpload/UploadFilesModuleWise/' + param,
                this.filesToUpload, this.date.toString()).subscribe((result: string) => {
                    console.log(result);
                    let fileStore: FileStoreModel = new FileStoreModel();
                    fileStore.FileStoreID = 0;
                    fileStore.IncidentId = this.currentIncident;
                    fileStore.DepartmentId = this.currentDepartmentId;
                    fileStore.OrganizationId = organizationId;
                    fileStore.FilePath = result;
                    fileStore.UploadedFileName = this.filesToUpload[0].name;
                    fileStore.CrewId = this.affectedPersonModelForStatus.CrewId;
                    fileStore.ModuleName = moduleName;
                    fileStore.CreatedBy = +this.credential.UserId;
                    fileStore.CreatedOn = new Date();
                    fileStore.ActiveFlag = 'Active';

                    this.fileStoreService.Create(fileStore)
                        .subscribe((response: FileStoreModel) => {
                            this.getAffectedPeople(this.currentIncident);
                            console.log(response);
                        });
                });
        }
    }

    saveUpdateAffectedPerson(affectedModifiedForm: AffectedPeopleToView): void {
        this.affectedPersonToUpdate.AffectedPersonId = affectedModifiedForm.AffectedPersonId;
        this.affectedPersonToUpdate.Identification = affectedModifiedForm.Identification;
        this.affectedPersonToUpdate.MedicalStatus = affectedModifiedForm['MedicalStatusToshow'];
        this.affectedPersonToUpdate.Remarks = affectedModifiedForm.Remarks;
        if (this.affectedPersonToUpdate.MedicalStatus != '')
            this.createCommunicationLogModel(this.affectedPersonToUpdate, affectedModifiedForm.CreatedBy);
        this.affectedPeopleService.Update(this.affectedPersonToUpdate)
            .subscribe((response: AffectedPeopleModel) => {
                this.toastrService.success('Additional Information updated.')
                if (this.filesToUpload.length) {
                    this.uploadFile();
                }
                this.getAffectedPeople(this.currentIncident);
                affectedModifiedForm['MedicalStatusToshow'] = affectedModifiedForm.MedicalStatus;
                let num = UtilityService.UUID();
                this.globalStateProxyOpen.NotifyDataChanged('AffectedPersonStatusChanged', num);
                this.childModal.hide();
            }, (error: any) => {
                alert(error);
            });
    }

    createCommunicationLogModel(affectedPersonToUpdate: AffectedPeopleModel, createdBy: number): void {
       
        let editedFields = '';
        let answer = '';
        let descchanged = '';
        this.communicationLogService.GetLogByAffectedPersonId(affectedPersonToUpdate.AffectedPersonId)
            .subscribe((result: ResponseModel<CommunicationLogModel>) => {
                if(result.Count==0){
                    this.insertCommunicationLog(affectedPersonToUpdate,createdBy);
                }
                else{
                    var QueryStatusFullText = result.Records[0].Queries;
                    
                    if(QueryStatusFullText.indexOf('Status changed to ')==-1){
                        this.insertCommunicationLog(affectedPersonToUpdate,createdBy);
                    }
                    else{
                        var MedicalStatus = QueryStatusFullText.split('Status changed to ')[1];
                        if (MedicalStatus.trim().toLowerCase() != affectedPersonToUpdate.MedicalStatus.trim().toLowerCase()) {
                            this.insertCommunicationLog(affectedPersonToUpdate,createdBy);
                        }
                    }
                }
                
                
            });

    }

    insertCommunicationLog(affectedPersonToUpdate:AffectedPeopleModel,createdBy:number):void{
        const communicationLogs: CommunicationLogModel[] = [];
        const communicationLog: CommunicationLogModel = new CommunicationLogModel();
        communicationLog.InteractionDetailsId = 0;
        communicationLog.InteractionDetailsType = GlobalConstants.InteractionDetailsTypeEnquiry;
        communicationLog.Queries = 'Medical Status changed to ' + affectedPersonToUpdate.MedicalStatus;
        communicationLog.Answers = 'Medical Status changed to ' + affectedPersonToUpdate.MedicalStatus;
        communicationLog.AffectedPersonId = affectedPersonToUpdate.AffectedPersonId;
        communicationLog.AffectedObjectId = null;
        communicationLog.EnquiryId = null;
        communicationLog.DemandId = null;
        communicationLog.RequesterName = this.userName;
        communicationLog.RequesterDepartment = this.currentDepartmentName;
        communicationLog.RequesterType = 'Medical Status change';
        communicationLog.ActiveFlag = 'Active';
        communicationLog.CreatedBy = createdBy;
        communicationLog.CreatedOn = new Date();

        communicationLogs.push(communicationLog);

        this.communicationLogService.CreateCommunicationLog(communicationLog)
            .subscribe((itemResult: CommunicationLogModel) => {
            });
    }


    cancelUpdate(affectedModifiedForm: AffectedPeopleToView): void {
        this.childModal.hide();
        this.affectedPersonModelForStatus = new AffectedPeopleToView();

    }

    getAffectedPeople(currentIncident): void {
        this.involvedPartyService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeople = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0])
                    .sort((a, b) => {
                        if (x => x.PassengerType) {
                            if (a.PassengerName < b.PassengerName) return -1;
                            if (a.PassengerName > b.PassengerName) return 1;
                            if (a.CrewName < b.CrewName) return -1;
                            if (a.CrewName > b.CrewName) return 1;
                            return 0;
                        }
                    });
                this.affectedPeople.forEach((x) => {
                    x['MedicalStatusToshow'] = x.MedicalStatus;
                    x['showDiv'] = false;
                });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    searchAffectedPeople(query: string, incidentId: number): void {
        this.involvedPartyService.GetQuery(query, incidentId)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeople = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
                this.affectedPeople.forEach((x) => {
                    x['MedicalStatusToshow'] = x.MedicalStatus;
                    x['showDiv'] = false;
                });
                console.log(this.affectedPeople);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    expandSearchPanel(value): void {
        if (!value) {
            this.searchValue = "Hide Search Panel";
        }
        else {
            this.searchValue = "Expand Search Panel";
        }
        this.expandSearch = !this.expandSearch;

    }

    incidentChangeHandler(incident: KeyValue) {
        this.currentIncident = incident.Value;
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/PassengerStatusInfo/' + this.currentIncident;
        this.downloadRoute = GlobalConstants.EXTERNAL_URL + 'api/Report/CrewStatusInfo/' + this.currentIncident;
        this.getAffectedPeople(this.currentIncident);
    }

    ngOnInit(): any {



        const token = UtilityService.GetFromSession('access_token');
        if (token) {
            const tokenData = jwtDecode(token);
            if (tokenData && tokenData.UserName)
                this.userName = tokenData.UserName;
        }


        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncident = +UtilityService.GetFromSession('ArchieveIncidentId');
            this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
            this.getAffectedPeople(this.currentIncident);
        }
        else {
            this.isArchive = false;
            this.currentIncident = +UtilityService.GetFromSession('CurrentIncidentId');
            this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
            this.getAffectedPeople(this.currentIncident);
        }
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/PassengerStatusInfo/' + this.currentIncident;
        this.downloadRoute = GlobalConstants.EXTERNAL_URL + 'api/Report/CrewStatusInfo/' + this.currentIncident;
        this.credential = UtilityService.getCredentialDetails();
        this.getCurrentDepartmentName(this.currentDepartmentId);
        this.initiateSearchConfigurations();
        this.IsDestroyed = false;
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));

        // Signal Notification
        this.globalState.Subscribe('ReceiveIncidentBorrowingCompletionResponse', () => {
            this.getAffectedPeople(this.currentIncident);
        });

        this.globalState.Subscribe('ReceivePassengerImportCompletionResponse', (count: number) => {
            if (count > 0)
                this.getAffectedPeople(this.currentIncident);
        });
    }

    IsNokInformed(event: any, id: number, name: string) {
        let affectedpersonToUpdate = new AffectedPeopleModel();
        affectedpersonToUpdate.IsNokInformed = event.checked;
        affectedpersonToUpdate.AffectedPersonId = id;
        this.affectedPeopleService.Update(affectedpersonToUpdate, id)
            .subscribe((response: AffectedPeopleModel) => {
                this.toastrService.success(`NOK information status updated`)
                this.getAffectedPeople(this.currentIncident);
            }, (error: any) => {
                alert(error);
            });
    }

    ngOnDestroy(): void {
        //  this.globalState.Unsubscribe('incidentChangefromDashboard');
    }

    openChatTrails(affectedPersonId: number): void {
        this.affectedPeopleService.GetCommunicationByPDA(affectedPersonId)
            .subscribe((response: ResponseModel<AffectedPeopleModel>) => {
                let responseModel: AffectedPeopleModel = response.Records[0];
                this.pdaNameForTrail = responseModel.Passenger != null ? responseModel.Passenger.PassengerName.toUpperCase() : '';
                this.pdaNameForTrail = this.pdaNameForTrail ? this.pdaNameForTrail : responseModel.Crew != null ? responseModel.Crew.CrewName.toUpperCase() : '';
                this.ticketNumber = responseModel.TicketNumber;
                this.communications = responseModel.CommunicationLogs;
                this.childModalForTrail.show();

            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelTrailModal() {
        this.childModalForTrail.hide();
    }

    openCallerList(affectedperson): void {
        this.affectedPersonModel = affectedperson;
        this.affectedPeopleService.GetCallerListForAffectedPerson(affectedperson.AffectedPersonId)
            .subscribe((response: ResponseModel<EnquiryModel>) => {
                this.callers = response.Records.map((x) => {
                    return x.Caller;
                });
                this.callers.forEach((x) => {
                    x['isnok'] = false;
                });
            });
    }

    cancelCallersModal() {
        this.childModalForCallers.hide();
    }

    saveNok(affectedpersonId, caller: CallerModel, event: any): void {
        if (event.checked) {
            let nok = new NextOfKinModel();
            nok.AffectedPersonId = affectedpersonId;
            nok.AlternateContactNumber = caller.AlternateContactNumber;
            nok.CallerId = caller.CallerId;
            nok.ContactNumber = caller.ContactNumber;
            nok.IncidentId = this.currentIncident;
            nok.NextOfKinName = caller.FirstName + '  ' + caller.LastName;
            nok.Relationship = caller.Relationship;
            nok.Location = caller.Location;
            let callertoupdate = new CallerModel();
            callertoupdate.IsNok = true;
            callertoupdate.deleteAttributes();
            this.affectedPeopleService.CreateNok(nok)
                .flatMap(() => this.callerservice.Update(callertoupdate, caller.CallerId))
                .subscribe(() => {
                    this.toastrService.success('NOK updated.');
                });
        }
        else {
            let callertoupdate = new CallerModel();
            callertoupdate.IsNok = false;
            callertoupdate.deleteAttributes();
            this.callerservice.Update(callertoupdate, caller.CallerId)
                .subscribe(() => {
                    this.toastrService.success('NOK updated.');
                });
        }
    }

    invokeSearch(query: string): void {
        if (query !== '') {
            if (query.indexOf('IsNokInformed') >= 0) {
                if (query.indexOf("'true'") >= 0)
                    query = query.replace("'true'", "true");
                if (query.indexOf("'false'") >= 0)
                    query = query.replace("'false'", "false");
            }
            if (query.toLowerCase().indexOf("contains(tolower(Passenger/PassengerType), 'crew')".toLowerCase()) >= 0) {
                let index = query.indexOf("contains(tolower(Passenger/PassengerType), ");
                let length = "contains(tolower(Passenger/PassengerType), ".length;
                query = query.replace(query.substring(index, length + 7), 'IsCrew eq true');
            }
            this.selectCurrentIncident();
            this.searchAffectedPeople(query, this.currentIncident);
        }

        else {
            this.selectCurrentIncident();
            this.getAffectedPeople(this.currentIncident);
        }

    }

    invokeReset(): void {
        this.selectCurrentIncident();
        this.getAffectedPeople(this.currentIncident);
    }

    private selectCurrentIncident() {
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncident = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.isArchive = false;
            this.currentIncident = +UtilityService.GetFromSession('CurrentIncidentId');
        }
    }

    private initiateSearchConfigurations(): void {
        let medstatus: Array<NameValue<string>> = GlobalConstants.MedicalStatus.map((x) => new NameValue<string>(x.caption, x.caption));
        const status: Array<NameValue<string>> = [
            new NameValue<string>('Informed', 'true'),
            new NameValue<string>('Not Informed', 'false'),
        ] as Array<NameValue<string>>;
        this.searchConfigs = [
            new SearchTextBox({
                Name: 'TicketNumber',
                Description: 'Reference Number',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'PDAName',
                Description: 'PDA Name',
                Value: '',
                OrCommand: 'Passenger/PassengerName|Crew/CrewName'
            }),
            new SearchTextBox({
                Name: 'Passenger/Pnr',
                Description: 'PNR',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'ContactNumber',
                Description: 'PDA Contact',
                Value: '',
                OrCommand: 'Passenger/ContactNumber|Crew/ContactNumber'
            }),
            new SearchTextBox({
                Name: 'Passenger/PassengerType',
                Description: 'Passenger Types',
                Value: ''
            }),
            new SearchDropdown({
                Name: 'MedicalStatus',
                Description: 'Medical Status',
                PlaceHolder: 'Select Status',
                Value: '',
                ListData: Observable.of(medstatus)
            }),
            new SearchDropdown({
                Name: 'IsNokInformed',
                Description: 'Is NOK Informed',
                PlaceHolder: 'Select Status',
                Value: '',
                ListData: Observable.of(status)
            })
        ];
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }
}