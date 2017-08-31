import {
    Component, ViewEncapsulation, Input,
    OnInit, OnDestroy, AfterContentInit, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

import {
    ResponseModel, DataExchangeService,
    UtilityService, GlobalConstants,
    FileUploadService, KeyValue, GlobalStateService, AuthModel, FileStoreModel
} from '../../../shared';
import { FileData, ValidationResultModel } from '../../../shared/models';

import { OrganizationService, OrganizationModel } from "../../shared.components/organization";
import { MasterDataUploadForValidService } from './masterdata.upload.valid.records.service';
import { IncidentModel } from '../../incident'


@Component({
    selector: 'masterdatauploadlist-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/masterdata.upload.list.view.html'
})

export class MasterDataUploadListComponent implements OnInit, OnDestroy {
    @Input() DepartmentId: number;
    @Input() IncidentId: number;
    @Input() CreatedBy: string;
    @ViewChild('inputFilePax') inputFilePax: any;
    @ViewChild('inputFileCrewManifestPAL') inputFileCrewManifestPAL: any;
    @ViewChild('inputFileCrewManifestPALEx') inputFileCrewManifestPALEx: any;
    @ViewChild('inputFileCrewTrainingPAL') inputFileCrewTrainingPAL: any;
    @ViewChild('inputFileCrewTrainingPALExAir') inputFileCrewTrainingPALExAir: any;
    @ViewChild('inputFileCrewTrainingPALExCabin') inputFileCrewTrainingPALExCabin: any;
    @ViewChild('inputFileCargo') inputFileCargo: any;
    @ViewChild('inputFileCargoPALEx') inputFileCargoPALEx: any;
    @ViewChild('inputFileGroundVictim') inputFileGroundVictim: any;
    @ViewChild('inputFileLoadSheet') inputFileLoadSheet: any;

    @ViewChild('validPassengersModal') public validPassengersModal: ModalDirective;
    @ViewChild('validCargoModal') public validCargoModal: ModalDirective;
    @ViewChild('validCrewModal') public validCrewModal: ModalDirective;
    @ViewChild('invalidCrewModal') public invalidCrewModal: ModalDirective;
    @ViewChild('invalidPassengersModal') public invalidPassengersModal: ModalDirective;
    @ViewChild('invalidCargoModal') public invalidCargoModal: ModalDirective;
    @ViewChild('validGroundVictimModal') public validGroundVictimModal: ModalDirective;
    @ViewChild('invalidGroundVictimModal') public invalidGroundVictimModal: ModalDirective;

    passengerTemplatePath: string = './assets/static-content/Passengers.xlsx';
    cargoTemplatePathPAL: string = './assets/static-content/CARGO_PRXXXX_ORGDES_YYYYMMDD_hhmm.xls';
    CargoTemplatePathPALEx: string = '/assets/static-content/CARGO_2PXXXX_ORGDES_YYYYMMDD_hhmm.xls';
    crewManifestPathPAL: string = './assets/static-content/PRCREW_PRXXX_ORGDES_YYYYMMDD.csv';
    crewTrainingPAL: string = './assets/static-content/PRCREW_TRAINING_PRXXX_ORGDES_YYYYMMDD.csv';
    crewManifestPathPALEx: string = './assets/static-content/2PCREW_2PXXX_ORGDES_YYYYMMDD.xls';    
    crewTrainingPALExAir: string = './assets/static-content/2PCREW_LISTOFAIRCREW_2PXXX_ORGDES_YYYYMMDD_hhmm.xls';
    crewTrainingPALExCabin: string = './assets/static-content/2PCREW_LISTOFCABINCREW_2PXXX_ORGDES_YYYYMMDD_hhmm.xls';
    groundVictimTemplatePath: string = './assets/static-content/GroundVictim.xlsx';

    filesToUpload: FileData[];
    filesLoadSheet: FileData[] = [];
    objFileData: FileData;
    form: FormGroup;
    disableUploadButton: boolean;
    credential: AuthModel
    currentOrganizationId: number = 0;
    currentOrganizationCode: string = "";
    orgLocalArray: OrganizationModel[] = [];
    
    loadSheetPath: string = '';
    loadSheetModuleName: string = 'LoadSheet';
    currentLoadSheetAvailable: boolean = false;
    currentLoadSheet: FileStoreModel = new FileStoreModel();
    

    constructor(formBuilder: FormBuilder,
        private fileUploadService: FileUploadService,
        private dataExchange: DataExchangeService<boolean>,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private globalState: GlobalStateService,
        private organizationService: OrganizationService,
        private _validRecordService: MasterDataUploadForValidService) {
        this.filesToUpload = [];
    }

    public ngOnInit(): void {
        this.disableUploadButton = true;
        this.filesToUpload = [];
        this.initiateForm();
        this.credential = UtilityService.getCredentialDetails();
        this.currentOrganizationId = +UtilityService.GetFromSession('CurrentOrganizationId');
        this.populateCurrentOrganization();
        this.CreatedBy = UtilityService.GetFromSession('CurrentUserId');;
        this.IncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.DepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.getCurrentLoadSheet(this.IncidentId);
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    public ngOnDestroy(): void {
        // this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

    reset(): void {
        this.inputFilePax.nativeElement.value = '';
        this.inputFileCrewManifestPAL.nativeElement.value = '';
        this.inputFileCrewManifestPALEx.nativeElement.value = '';
        this.inputFileCrewTrainingPAL.nativeElement.value = '';
        this.inputFileCrewTrainingPALExAir.nativeElement.value = '';
        this.inputFileCrewTrainingPALExCabin.nativeElement.value = '';
        this.inputFileCargo.nativeElement.value = '';
        this.inputFileCargoPALEx.nativeElement.value = '';
        this.inputFileGroundVictim.nativeElement.value = '';
        this.inputFileLoadSheet.nativeElement.value = '';
    }

    populateCurrentOrganization() : void
    {
        this.organizationService.GetAllActiveOrganizations().subscribe((response: ResponseModel<OrganizationModel>) =>{
            this.orgLocalArray = response.Records.filter(a=>a.OrganizationId == this.currentOrganizationId);
            if(this.orgLocalArray.length > 0)
                {
                    this.currentOrganizationCode = this.orgLocalArray[0].OrganizationCode;
                }
        });
    }

    uploadFiles(): void {
        if(this.filesLoadSheet.length > 0)
        {
            this.uploadLoadSheet();
        }
        if(this.filesToUpload.length > 0)
        {
            this.disableUploadButton = false;
            const baseUrl = GlobalConstants.EXTERNAL_URL;
            const param = 'IncidentId=' + this.IncidentId + '&CreatedBy=' + this.CreatedBy;

            this.fileUploadService.uploadFiles<ValidationResultModel[]>(baseUrl + './api/MasterDataUploadBatch?' + param, this.filesToUpload)
                .subscribe((result: ValidationResultModel[]) => {
                    console.log('success');
                    this.filesToUpload = [];
                    //this.toastrService.success('Uploaded Data is processed successfully.' + '\n'
                        //   + 'To check any invalid records, please refer \'View Invalid Records\' link for the current timestamp.', 'Success', this.toastrConfig);
                    result.forEach(item=>{
                        if(item.ResultType == 1)
                        {
                            this.toastrService.error(item.Message, 'Error', this.toastrConfig);
                        }
                        else if(item.ResultType == 3)
                        {
                            this.toastrService.success(item.Message, 'Success', this.toastrConfig);
                        }                            
                    });                    
                    this.form.reset();
                    this.disableUploadButton = true;

                }, (error) => {
                    console.log(`Error: ${error}`);
                    this.toastrService.error(error, 'Error', this.toastrConfig);
                });
        }
              
    }

    uploadLoadSheet(): void {
        this.disableUploadButton = false;
        const baseUrl = GlobalConstants.EXTERNAL_URL;
        let organizationId = +UtilityService.GetFromSession('CurrentOrganizationId');
        let moduleName = this.loadSheetModuleName;
        let param = `${this.IncidentId}/${organizationId}/${this.DepartmentId}/${moduleName}/${this.CreatedBy}`;

        if(this.filesLoadSheet.length > 0)
        {
            this.fileUploadService.uploadFiles<FileStoreModel>(baseUrl + './api/fileUpload/UploadLoadSheetFile/' + param, this.filesLoadSheet)
            .subscribe((result: FileStoreModel) =>{
                this.filesLoadSheet = [];
                this.inputFileLoadSheet.nativeElement.value = '';
                this.getCurrentLoadSheet(this.IncidentId);
                this.toastrService.success('Load sheet document is uploaded successfully', 'Success', this.toastrConfig);
            })
        }

    }

    getFileDetails(e: any, type: string): void {
        this.disableUploadButton = false;

        for (let i = 0; i < e.target.files.length; i++) {
            const extension = e.target.files[i].name.split('.').pop();

            if (extension.toLowerCase() == 'xls' || extension.toLowerCase() == 'xlsx' || extension.toLowerCase() == 'csv') {
                this.objFileData = new FileData();
                this.objFileData.field = type;
                this.objFileData.file = e.target.files[i];
                this.filesToUpload.push(this.objFileData);
            }
            else {
                this.toastrService.error('Invalid File Format!', 'Error', this.toastrConfig);
                this.form.reset();
                this.disableUploadButton = true;
            }
        }
    }

    getLoadSheetFileDetails(e: any, type: string): void {
        this.filesLoadSheet = [];
        this.disableUploadButton = false;
        for (let i = 0; i < e.target.files.length; i++) {
            const extension = e.target.files[i].name.split('.').pop();

            if(extension.toLowerCase() == 'exe' || extension.toLowerCase() == 'dll')
            {
                this.toastrService.error('File Extension: "exe" and "dll" are not allowed to upload!', 'Error', this.toastrConfig);
                this.form.reset();
                this.disableUploadButton = true;
            }
            else
            {
                let objFileLoadSheet = new FileData();
                objFileLoadSheet.field = type;
                objFileLoadSheet.file = e.target.files[i];
                this.filesLoadSheet.push(objFileLoadSheet);
            }
        }
    }

    getCurrentLoadSheet(incidentId: number) : void {
        this._validRecordService.GetCurrentIncidentWithLoadSheet(incidentId)
        .subscribe((response: ResponseModel<IncidentModel>)=>{
            const currentIncidentObject = response.Records[0];
            let localFileStoreLoadSheet = [];
            if(currentIncidentObject.FileStores.length > 0)
            {
                localFileStoreLoadSheet = currentIncidentObject.FileStores
                .filter(a=>a.ModuleName.toLowerCase() == this.loadSheetModuleName.toLowerCase());
                if(localFileStoreLoadSheet.length > 0)
                {
                    this.currentLoadSheet = localFileStoreLoadSheet[0];
                    this.currentLoadSheetAvailable = true;
                    this.loadSheetPath = GlobalConstants.EXTERNAL_URL + 
                    './api/FileDownload/GetFile/' + this.loadSheetModuleName + '/' + this.currentLoadSheet.FileStoreID;
                } 
                else
                {
                    this.currentLoadSheet = new FileStoreModel();
                    this.currentLoadSheetAvailable = false;
                    this.loadSheetPath = '';
                }
            }
            else
            {
                this.currentLoadSheet = new FileStoreModel();
                this.currentLoadSheetAvailable = false;
                this.loadSheetPath = '';
            }
        });
    }

    openPassenger(): void {
        this.validPassengersModal.show();
        this.dataExchange.Publish('OpenPassengers', true);
    }
    closePassenger(): void {
        this.validPassengersModal.hide();
    }

    openCrew(): void {
        this.validCrewModal.show();
        this.dataExchange.Publish('OpenCrews', true);
    }
    closeCrew(): void {
        this.validCrewModal.hide();
    }

    openCargo(): void {
        this.validCargoModal.show();
        this.dataExchange.Publish('OpenCargoes', true);
    }
    closeCargo(): void {
        this.validCargoModal.hide();
    }

    openInvalidPax(): void {
        this.invalidPassengersModal.show();
        this.dataExchange.Publish('OpenInvalidPassengers', true);
    }
    closeInvalidPax(): void {
        this.invalidPassengersModal.hide();
    }

    openInvalidCrew(): void {
        this.invalidCrewModal.show();
        this.dataExchange.Publish('OpenInvalidCrews', true);
    }
    closeInvalidCrew(): void {
        this.invalidCrewModal.hide();
    }

    openInvalidCargo(): void {
        this.invalidCargoModal.show();
        this.dataExchange.Publish('OpenInvalidCargoes', true);
    }
    closeInvalidCargo(): void {
        this.invalidCargoModal.hide();
    }

    openGroundVictims(): void {
        this.validGroundVictimModal.show();
        this.dataExchange.Publish('OpenGroundVictims', true);
    }

    closeGroundVictim(): void {
        this.validGroundVictimModal.hide();
    }

    openInvalidGroundVictims(): void {
        this.invalidGroundVictimModal.show();
        this.dataExchange.Publish('OpenInvalidGroundVictims', true);
    }

    closeInvalidGroundVictim(): void {
        this.invalidGroundVictimModal.hide();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;
        this.currentOrganizationId = +UtilityService.GetFromSession('CurrentOrganizationId');
        this.populateCurrentOrganization();
        this.getCurrentLoadSheet(this.IncidentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.DepartmentId = department.Value;
    }

    private initiateForm(): void {
        this.form = new FormGroup({
            filePax: new FormControl(),
            fileCrewManifestPAL: new FormControl(),
            fileCrewManifestPALEx: new FormControl(),
            fileCrewTrainingPAL: new FormControl(),
            fileCrewTrainingPALExAir: new FormControl(),
            fileCrewTrainingPALExCabin: new FormControl(),
            fileCargo: new FormControl(),
            fileCargoPALEx: new FormControl(),
            fileGroundVictim: new FormControl()
            
        });
    }
}