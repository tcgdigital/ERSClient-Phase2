import {
    Component, OnInit, Input, OnDestroy,
    ViewEncapsulation, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
    FormGroup, FormControl, FormBuilder, Validators,
    ReactiveFormsModule
} from '@angular/forms';
import {  } from "../";
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import {
    DataServiceFactory, DataExchangeService, ResponseModel, FileUploadService,
    TextAccordionModel, GlobalStateService, KeyValue, GlobalConstants, IUploadDocuments
} from '../../../shared'
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
    selector: 'archive-upload-widget',
    templateUrl: './archive.upload.widget.view.html',
    styleUrls: ['./archive.upload.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ArchiveUploadWidgetComponent implements OnInit, OnDestroy {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;

    @ViewChild('myFileInput') myInputVariable: any;
    public form: FormGroup;
    filesToUpload: Array<File>;
    filepathWithLinks: string = null;
    fileName: string = null;
    uploadDocuments: IUploadDocuments[];

    constructor(formBuilder: FormBuilder, private fileUploadService: FileUploadService, private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) { }

    public ngOnInit(): void {
        this.uploadDocuments = GlobalConstants.UploadDocuments;
        this.form = new FormGroup({
            uploadDocumentControl: new FormControl(0)
        });
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    };

    public upload() {
        debugger;
        let dropdownselected: string = this.form.controls['uploadDocumentControl'].value;
        if (dropdownselected == '0') {
            this.toastrService.error('Please select document type and then upload.', 'Document Upload', this.toastrConfig);
            return false;
        }
        if (this.filesToUpload != undefined) {
            let baseUrl = GlobalConstants.EXTERNAL_URL;
            this.fileUploadService.uploadFiles<string>(baseUrl + "api/fileUpload/upload", this.filesToUpload)
                .subscribe((result: string) => {
                    debugger;
                    this.filepathWithLinks = `${GlobalConstants.EXTERNAL_URL}UploadFiles/${result.replace(/^.*[\\\/]/, '')}`;
                    let extension = result.replace(/^.*[\\\/]/, '').split('.').pop();
                    if (dropdownselected == '1') {
                        this.fileName = 'View_Lessons_Learnt' + `.${extension}`;
                    }
                    else if (dropdownselected == '2') {
                        this.fileName = 'View_Audit_Report' + `.${extension}`;
                    }
                    this.OnDocumentUploaded();

                }, (error) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.toastrService.error('Please select alteast one file to upload.', 'Document Upload', this.toastrConfig);
            return false;
        }
    }

    public OnDocumentUploaded():void{
// var archieveDocumentType = {
//                 ArchieveDocumentTypeId: 0,
//                 IncidentId: $scope.IncidentId,
//                 DocumentType: $scope.UploadDoc.UploadDocument,
//                 DocumentUploadPath: fullFilePath,
//                 ActiveFlag: "Active",
//                 CreatedBy: $scope.createdBy,
//                 CreatedOn: new Date()
//             }


    }

    public fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    public clearFileUpload(event: any): void {
        this.myInputVariable.nativeElement.value = "";
        this.filepathWithLinks = null;
        this.fileName = null;
    }

    // public GetArchiveDocumentTypeData(incidentId: number, callback?: Function): void {
    //     this.archiveDocumentTypeService.GetByIncident(incidentId)
    //         .subscribe((result: ResponseModel<ArchiveDocumentTypeModel>) => {
    //             this.otherReports=[];
    //             result.Records.forEach((item: ArchiveDocumentTypeModel) => {
    //                 let otherReport: OtherReportModel = new OtherReportModel();
    //                 otherReport.FilePathWithName = "../../../UploadFiles/" + item.DocumentUploadPath.replace(/^.*[\\\/]/, '');
    //                 otherReport.Extension = item.DocumentUploadPath.replace(/^.*[\\\/]/, '').split('.').pop();
    //                 otherReport.DocumentType=item.DocumentType;
    //                 if (item.DocumentType == '1') {
    //                     otherReport.FileName = "View_Lessons_Learnt." + otherReport.Extension;
    //                 }
    //                 else if (item.DocumentType == '2') {
    //                     otherReport.FileName = "View_Audit_Report." + otherReport.Extension;
    //                 }
    //                 this.otherReports.push(otherReport);
    //             });
    //             if (callback) {
    //                 callback();
    //             }
    //         });
    // }

    // public GetDepartmentClosureData(incidentId: number, callback?: Function): void {
    //     this.departmentClosureService.GetAllByIncident(incidentId)
    //         .subscribe((result: ResponseModel<DepartmentClosureModel>) => {
    //             this.otherReports=[];
    //             this.departmentWiseClosureReports = result.Records;
    //             if (callback) {
    //                 callback();
    //             }
    //         });
    // }

    private incidentChangeHandler(incident: KeyValue): void {
        this.incidentId = incident.Value;
    };

    private departmentChangeHandler(department: KeyValue): void {
        this.departmentId = department.Value;
    };

    // private openModalDepartmentWiseCloseReport(): void {
    //     this.GetDepartmentClosureData(this.incidentId, () => {
    //         this.childModalDepartmentWiseCloseReport.show();
    //     });
    // };

    // private hideModalDepartmentWiseCloseReport(): void {
    //     this.childModalDepartmentWiseCloseReport.hide();
    // };

    // public openModalOtherReport(): void {
    //     this.GetArchiveDocumentTypeData(this.incidentId, () => {
    //         this.childModalOtherReport.show();
    //     });
    // };

    // private hideModalOtherReport(): void {
    //     this.childModalOtherReport.hide();
    // };

    ngOnDestroy(): void {
        // this.globalState.Unsubscribe('incidentChange');
        // this.globalState.Unsubscribe('departmentChange');
    }
}
