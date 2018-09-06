import { Component, ViewEncapsulation, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import { EmergencyLocationService } from './emergencylocation.service';
import { EmergencyLocationModel } from './emergencylocation.model';

import { ITimeZone } from '../../../../shared/models/base.model';
import { GlobalTimeZone } from '../../../../shared/constants/timezone';

import {
    DataExchangeService, FileUploadService,
    GlobalConstants, UtilityService, AuthModel
} from '../../../../shared';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'emergencylocation-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/emergencylocation.entry.view.html'
})
export class EmergencyLocationEntryComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    mailAddress: FormControl;
    emergencyLocation: EmergencyLocationModel;
    date: Date = new Date();
    emergencyLocations: EmergencyLocationModel[] = [];
    Action: string;
    numaricRegex = '/^[0-9]{10,10}$/';
    showAdd: boolean = false;
    credential: AuthModel;
    filesToUpload: File[];
    isDisabledUpload = true;
    isInvalidForm: boolean = false;
    airportStationTemplatePath: string = './assets/static-content/AirportStation.xlsx';
    @ViewChild('inputFileStations') inputFileStations: any;
    public showAddText: string = 'ADD RESPONSIBLE STATION';
    public timeZones: ITimeZone[];
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private emergencyLocationService: EmergencyLocationService,
        private dataExchange: DataExchangeService<EmergencyLocationModel>,
        private builder: FormBuilder, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private fileUploadService: FileUploadService) {
        this.timeZones = GlobalTimeZone.TimeZones;
        // console.log(this.timeZones);
        this.emergencyLocation = new EmergencyLocationModel();
    }

    ngOnInit(): void {
        this.emergencyLocation.Active = true;
        this.showAdd = false;
        this.isInvalidForm = false;
        this.initiateForm();
        this.credential = UtilityService.getCredentialDetails();

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.OnEmergencyLocationUpdate,
            (model: EmergencyLocationModel) => this.onEmergencyLocationUpdate(model));
    }

    onEmergencyLocationUpdate(model: EmergencyLocationModel) {
        this.emergencyLocation = new EmergencyLocationModel();
        this.emergencyLocation = model;
        if (model.ActiveFlag === 'Active')
            this.emergencyLocation.Active = true;
        else
            this.emergencyLocation.Active = false;
        this.Action = 'Edit';
        this.showAddRegion(this.showAdd);
        this.showAdd = true;

        this.form = new FormGroup({
            EmergencyLocationId: new FormControl(model.EmergencyLocationId),
            IATA: new FormControl(model.IATA),
            AirportName: new FormControl(model.AirportName),
            City: new FormControl(model.City),
            Country: new FormControl(model.Country),
            fileStation: new FormControl(),
            TimeZone: new FormControl(model.TimeZone),
            isActive: new FormControl(this.emergencyLocation.Active)
        });

        window.scrollTo(0, 0);
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.OnEmergencyLocationUpdate);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getFileDetails(e: any): void {
        this.filesToUpload = [];
        this.isDisabledUpload = false;
        for (var i = 0; i < e.target.files.length; i++) {
            const extension = e.target.files[i].name.split('.').pop();

            if (extension.toLowerCase() == 'xlsx') {
                this.filesToUpload.push(e.target.files[i]);
            }
            else {
                this.toastrService.error('Invalid File Format!', 'Error', this.toastrConfig);
                this.inputFileStations.nativeElement.value = '';
                this.isDisabledUpload = true;
            }
        }
    }

    Upload(): void {
        if (this.filesToUpload.length) {
            const baseUrl = GlobalConstants.EXTERNAL_URL;
            const param = this.credential.UserId;
            const errorMsg: string = '';
            this.date = new Date();

            this.fileUploadService.uploadFiles<string>(baseUrl + './api/MasterDataExportImport/AirportStationUpload/' + param,
                this.filesToUpload, this.date.toString())
                .subscribe((result: string) => {
                    if (result.startsWith('Error:')) {
                        this.toastrService.error(result, 'Error', this.toastrConfig);
                    }
                    else {
                        this.toastrService.success('File Uploaded successfully.\n' + result, 'Success', this.toastrConfig);
                    }
                    this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.FileUploadedSuccessfully, new EmergencyLocationModel());
                    this.initiateForm();
                    this.isDisabledUpload = true;
                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
                });
        } else {
            this.toastrService.error('Invalid File Format!', 'Error', this.toastrConfig);
            this.initiateForm();
            this.isDisabledUpload = true;
        }
    }

    onSubmit() {
        delete this.emergencyLocation.Active;
        if (this.form.valid) {
            this.isInvalidForm = false;
            UtilityService.setModelFromFormGroup<EmergencyLocationModel>(this.emergencyLocation, this.form,
                (x) => x.EmergencyLocationId, (x) => x.IATA, (x) => x.AirportName, (x) => x.Country, (x) => x.City);

            const timeZone: string = this.form.controls['TimeZone'].value;
            const utcOffset: string = this.timeZones.filter((a) => a.zonename == timeZone)[0].decimaloffset;
            const utcOffsetInMS: string = (+utcOffset * 3600 * 1000).toString();

            this.emergencyLocation.TimeZone = timeZone;
            this.emergencyLocation.UTCOffset = utcOffsetInMS;
            if (this.emergencyLocation.EmergencyLocationId == 0) {
                this.emergencyLocation.CreatedBy = +this.credential.UserId;

                if (this.form.controls['isActive'].value != false)
                    this.emergencyLocation.ActiveFlag = 'Active';
                else
                    this.emergencyLocation.ActiveFlag = 'InActive';

                this.emergencyLocationService.Create(this.emergencyLocation)
                    .subscribe((response: EmergencyLocationModel) => {
                        this.toastrService.success('Crisis Location is created Successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.EmergencyLocationModelSaved, response);
                        this.initiateForm();
                        this.showAddRegion(this.showAdd);
                        this.showAdd = false;
                    }, (error: any) => {
                        console.log(`Error: ${error.message}`);
                    });
            }
            else {
                if (this.form.controls['isActive'].value != false)
                    this.emergencyLocation.ActiveFlag = 'Active';
                else
                    this.emergencyLocation.ActiveFlag = 'InActive';
                    
                this.emergencyLocationService.Update(this.emergencyLocation)
                    .subscribe((response: EmergencyLocationModel) => {
                        this.toastrService.success('Crisis Location is updated Successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.EmergencyLocationModelUpdated, response);
                        this.initiateForm();
                        this.showAddRegion(this.showAdd);
                        this.showAdd = false;
                    }, (error: any) => {
                        console.log(`Error: ${error.message}`);
                    });
            }
        }
        else {
            this.isInvalidForm = true;
        }
    }

    showAddRegion(value): void {
        if (!value) {
            this.showAddText = 'CLICK TO COLLAPSE';
        }
        else {
            this.showAddText = 'ADD RESPONSIBLE STATION';
        }

        window.setInterval(() => {
            jQuery(window).scroll();
        }, 100);

        this.showAdd = !value;
    }

    cancel(): void {
        this.initiateForm();
        this.showAddRegion(this.showAdd);
        this.showAdd = false;
        this.isInvalidForm = false;
    }

    private initiateForm(): void {
        this.emergencyLocation = new EmergencyLocationModel();
        this.Action = 'Save';

        this.form = new FormGroup({
            EmergencyLocationId: new FormControl(0),
            IATA: new FormControl('', [Validators.required]),
            AirportName: new FormControl('', Validators.required),
            City: new FormControl('', Validators.required),
            Country: new FormControl('', Validators.required),
            fileStation: new FormControl(),
            TimeZone: new FormControl('', Validators.required),
            isActive: new FormControl(false)
        });
    }
}