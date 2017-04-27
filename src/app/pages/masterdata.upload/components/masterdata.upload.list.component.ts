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
import { ModalDirective } from 'ng2-bootstrap/modal';

import {
    ResponseModel, DataExchangeService,
    UtilityService, GlobalConstants,
    FileUploadService, KeyValue, GlobalStateService
} from '../../../shared';
import { FileData } from '../../../shared/models';

@Component({
    selector: 'masterdatauploadlist-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/masterdata.upload.list.view.html'
})

export class MasterDataUploadListComponent implements OnInit, OnDestroy {
    @Input() DepartmentId: number;
    @Input() IncidentId: number;
    @Input() CreatedBy: string;

    @ViewChild('validPassengersModal') public validPassengersModal: ModalDirective;
    @ViewChild('validCargoModal') public validCargoModal: ModalDirective;
    @ViewChild('validCrewModal') public validCrewModal: ModalDirective;
    @ViewChild('invalidCrewModal') public invalidCrewModal: ModalDirective;
    @ViewChild('invalidPassengersModal') public invalidPassengersModal: ModalDirective;
    @ViewChild('invalidCargoModal') public invalidCargoModal: ModalDirective;

    passengerTemplatePath: string = "../../../DownloadFiles/Passengers.xlsx";
    cargoTemplatePath: string = "../../../DownloadFiles/Cargo.xlsx";
    crewTemplatePath: string = "../../../DownloadFiles/Crews.xlsx";

    // isHiddenValidPax: boolean = true;
    // isHiddenValidCargo: boolean = true;
    // isHiddenValidCrew: boolean = true;
    // isHiddenInvalidPax: boolean = true;
    // isHiddenInvalidCargo: boolean = true;
    // isHiddenInvalidCrew: boolean = true;

    filesToUpload: Array<FileData>;
    objFileData: FileData;

    constructor(formBuilder: FormBuilder,
        private fileUploadService: FileUploadService,
        private dataExchange: DataExchangeService<boolean>, 
        private toastrService: ToastrService,
		private toastrConfig: ToastrConfig,
        private globalState: GlobalStateService) {
        this.filesToUpload = [];
    }

    public ngOnInit(): void {
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    public ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

    uploadFiles(): void {
        let baseUrl = GlobalConstants.EXTERNAL_URL;
        let param = "IncidentId=" + this.IncidentId + "&CreatedBy=" + this.CreatedBy;
        this.fileUploadService.uploadFiles<string>(baseUrl + "./api/MasterDataUploadBatch?" + param, this.filesToUpload)
            .subscribe((result: any) => {
<<<<<<< HEAD
                console.log("success");
                alert("Uploaded Data is processed successfully." + '\n' + "To check any invalid records, please refer \"View Invalid Records\" link for the current timestamp.");
            }, (error) => {
                console.log(`Error: ${error}`);
            });
    }

    getFileDetails(e: any, type: string): void {
=======
                    console.log("success");     
                     this.toastrService.success("Uploaded Data is processed successfully." + '\n' + "To check any invalid records, please refer \"View Invalid Records\" link for the current timestamp.", 'Success', this.toastrConfig);               
                },(error) => {
                    console.log(`Error: ${error}`);
                });
    }        

    getFileDetails(e: any, type: string): void{
>>>>>>> master
        this.filesToUpload = [];

        for (var i = 0; i < e.target.files.length; i++) {
            var extension = e.target.files[i].name.split('.').pop();

            if (extension.toLowerCase() == "xls" || extension.toLowerCase() == "xlsx") {
                this.objFileData = new FileData();
                this.objFileData.field = type;
                this.objFileData.file = e.target.files[i];
                this.filesToUpload.push(this.objFileData);
            }
        }
    }

    openPassenger(): void {
        this.validPassengersModal.show();
    }
    closePassenger(): void {
        this.validPassengersModal.hide();
    }
    
    openCrew(): void {
        this.validCrewModal.show();
    }
    closeCrew(): void {
        this.validCrewModal.hide();
    }

    openCargo(): void {
        this.validCargoModal.show();
    }
    closeCargo(): void {
        this.validCargoModal.hide();
    }

    openInvalidPax(): void {
        this.invalidPassengersModal.show();
    }
    closeInvalidPax(): void {
        this.invalidPassengersModal.hide();
    }

    openInvalidCrew(): void {
        this.invalidCrewModal.show();
    }
    closeInvalidCrew(): void {
        this.invalidCrewModal.hide();
    }

    openInvalidCargo(): void {
        this.invalidCargoModal.show();
    }
    closeInvalidCargo(): void {
        this.invalidCargoModal.hide();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;
    };

    private departmentChangeHandler(department: KeyValue): void {
        this.DepartmentId = department.Value;
    };
}