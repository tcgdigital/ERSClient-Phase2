import { Component, ViewEncapsulation, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    Validators,
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import { QuickLinkModel } from './quicklink.model';
import { QuickLinkService } from './quicklink.service';
import {
    DataExchangeService,
    AuthModel, UtilityService, FileUploadService, GlobalConstants,
    IUploadDocuments
} from '../../../../shared';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'quicklink-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/quicklink.entry.view.html'
})
export class QuickLinkEntryComponent implements OnInit, OnDestroy {
    @ViewChild('myFileInput') myInputVariable: any;

    public form: FormGroup;
    public submitted: boolean;
    filesToUpload: File[];
    filepathWithLinks: string = null;
    fileName: string = null;
    uploadDocuments: IUploadDocuments[];
    quickLinkModel: QuickLinkModel = null;
    quickLinkModelEdit: QuickLinkModel = null;
    date: Date = new Date();
    quickLinks: QuickLinkModel[] = [];
    showAdd: Boolean = false;
    isFileUploaded: boolean = false;
    buttonValue: String = "";
    credential: AuthModel;
    public showAddText: string = 'ADD QUICKLINK';
    isValidUrl: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of QuickLinkEntryComponent.
     * @param {FormBuilder} formBuilder
     * @param {QuickLinkService} quickLinkService
     * @param {DataExchangeService<QuickLinkModel>} dataExchange
     * @param {FileUploadService} fileUploadService
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     * @memberof QuickLinkEntryComponent
     */
    constructor(formBuilder: FormBuilder,
        private quickLinkService: QuickLinkService,
        private dataExchange: DataExchangeService<QuickLinkModel>,
        private fileUploadService: FileUploadService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {
        this.showAdd = false;
        this.buttonValue = "Add QuickLink";
    }

    ngOnInit(): void {
        this.fileName = null;
        this.submitted = false;
        this.credential = UtilityService.getCredentialDetails();
        this.initializeInputForm();
        this.initiateQuickLinkModel();

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.QuickLinkModelEdited,
            (model: QuickLinkModel) => this.onQuickLinkEditSuccess(model));
    }

    initializeInputForm(): void {
        this.form = new FormGroup({
            QuickLinkId: new FormControl(0),
            QuickLinkName: new FormControl('', [Validators.required]),
            QuickLinkURL: new FormControl('')
        });

        this.filepathWithLinks = null;
        this.fileName = null;
        this.submitted = false;
    }

    public fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    public clearFileUpload(event: any): void {
        this.myInputVariable.nativeElement.value = '';
        this.filepathWithLinks = null;
        this.fileName = null;
    }

    public upload() {
        if (this.filesToUpload !== undefined) {
            const baseUrl = GlobalConstants.EXTERNAL_URL;

            this.fileUploadService.uploadFiles<string>(baseUrl + 'api/fileUpload/upload', this.filesToUpload)
                .subscribe((result: string) => {
                    this.filepathWithLinks = `${GlobalConstants.EXTERNAL_URL}UploadFiles/${result.replace(/^.*[\\\/]/, '')}`;
                    const extension = result.replace(/^.*[\\\/]/, '').split('.').pop();
                    this.fileName = 'Quicklink' + `.${extension}`;
                }, (error) => {
                    console.log(`Error: ${error.message}`);
                });
        }
        else {
            this.toastrService.error('Please select alteast one file to upload.', 'Document Upload', this.toastrConfig);
            return false;
        }
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.QuickLinkModelEdited);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    initiateQuickLinkModel(): void {
        this.quickLinkModel = new QuickLinkModel();
        this.quickLinkModel.ActiveFlag = 'Active';
        this.quickLinkModel.CreatedBy = +this.credential.UserId;
        this.quickLinkModel.CreatedOn = this.date;
    }

    onSubmit(values: Object): void {
        this.submitted = true;

        if (this.form.valid) {
            if (this.form.controls['QuickLinkURL'].value != '') { //URL Validation Region
                // const bolValid = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\~\+#]*[\w\-\@?^=%&amp;\~\+#])?$/.test(this.form.controls['QuickLinkURL'].value);
                const bolValid = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/.test(this.form.controls['QuickLinkURL'].value);
                if (!bolValid) {
                    this.isValidUrl = true;
                    return;
                }
                else {
                    this.isValidUrl = false;
                }
            }
            if ((this.form.controls['QuickLinkURL'].value == undefined || this.form.controls['QuickLinkURL'].value == '')
                && (this.filepathWithLinks == null)) {
                this.toastrService.error('QuickLink URL is required or a file must be uploaded', 'Error', this.toastrConfig)
            }
            else {
                if (this.quickLinkModel.QuickLinkId == 0) {//ADD REGION
                    delete this.quickLinkModel.Active;
                    this.quickLinkModel.QuickLinkName = this.form.controls['QuickLinkName'].value;
                    this.quickLinkModel.QuickLinkURL = this.form.controls['QuickLinkURL'].value;
                    this.quickLinkModel.UploadURL = this.filepathWithLinks;

                    this.quickLinkService.Create(this.quickLinkModel)
                        .subscribe((response: QuickLinkModel) => {
                            this.initializeInputForm();
                            this.toastrService.success('Quick link saved Successfully.', 'Success', this.toastrConfig);
                            this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.QuickLinkModelSaved, response);
                            this.showAddRegion(this.showAdd);
                            this.showAdd = false;
                            this.initiateQuickLinkModel();
                        }, (error: any) => {
                            console.log(`Error: ${error.message}`);
                        });
                }

                else {//EDIT REGION
                    this.formControlDirtyCheck();
                    this.quickLinkModelEdit.UploadURL = this.filepathWithLinks;
                    delete this.quickLinkModelEdit.Active;
                    this.quickLinkModelEdit.deleteAttributes();

                    this.quickLinkService.Update(this.quickLinkModelEdit)
                        .subscribe((response: QuickLinkModel) => {
                            this.toastrService.success('Quick link edited Successfully.', 'Success', this.toastrConfig);
                            this.initializeInputForm();
                            this.initiateQuickLinkModel();
                            this.showAddRegion(this.showAdd);
                            this.showAdd = false;
                        }, (error: any) => {
                            console.log(`Error: ${error.message}`);
                        });
                }
            }
        }
    }

    cancel(): void {
        this.submitted = false;
        this.initiateQuickLinkModel();
        this.showAddRegion(this.showAdd);
        this.showAdd = false;
        this.isValidUrl = false;
        this.initializeInputForm();
        this.clearFileUpload(true);
    }

    formControlDirtyCheck() {
        this.quickLinkModelEdit = new QuickLinkModel();
        this.quickLinkModelEdit.QuickLinkId = this.form.controls['QuickLinkId'].value;
        this.quickLinkModel.QuickLinkId = this.form.controls['QuickLinkId'].value;
        this.quickLinkModel.UploadURL = this.filepathWithLinks;
        if (this.form.controls['QuickLinkName'].touched) {
            this.quickLinkModelEdit.QuickLinkName = this.form.controls['QuickLinkName'].value;
            this.quickLinkModel.QuickLinkName = this.form.controls['QuickLinkName'].value;
        }
        if (this.form.controls['QuickLinkURL'].touched) {
            this.quickLinkModelEdit.QuickLinkURL = this.form.controls['QuickLinkURL'].value;
            this.quickLinkModel.QuickLinkURL = this.form.controls['QuickLinkURL'].value;
        }
    }

    onQuickLinkEditSuccess(data: QuickLinkModel): void {
        this.filepathWithLinks = null;
        this.fileName = null;
        this.showAddRegion(this.showAdd);
        this.showAdd = true;
        this.initiateQuickLinkModel();
        this.quickLinkModel = data;

        this.form = new FormGroup({
            QuickLinkId: new FormControl(this.quickLinkModel.QuickLinkId),
            QuickLinkName: new FormControl(this.quickLinkModel.QuickLinkName,
                [Validators.required]),
            QuickLinkURL: new FormControl(this.quickLinkModel.QuickLinkURL)
        });
        this.filepathWithLinks = this.quickLinkModel.UploadURL;
        if (this.filepathWithLinks != null) {
            const extension = this.filepathWithLinks.replace(/^.*[\\\/]/, '').split('.').pop();
            this.fileName = 'Quicklink' + `.${extension}`;
        }

        window.scrollTo(0, 0);
    }

    showAddRegion(value): void {
        // this.showAdd = true;
        if (!value) {
            this.showAddText = "CLICK TO COLLAPSE";
        }
        else {
            this.showAddText = "ADD QUICKLINK";
        }

        window.setInterval(() => {
            jQuery(window).scroll();
        }, 100);

        this.showAdd = !value;
    }
}