import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {
    FormGroup, FormControl, Validators
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { GlobalConstants, UtilityService, GlobalStateService, KeyValue, KeyValueService } from "../../shared";
import { ExternalInputModel, PDAEnquiryModel, CargoEnquiryModel, MediaAndOtherQueryModel } from "./component/callcenteronlypage.model";
import { CallCenterOnlyPageService } from "./component/callcenteronlypage.service";
import { CallerModel } from "../shared.components/caller";

@Component({
    selector: 'login',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/callcenteronlypage.view.html',
    styleUrls: ['./styles/call.center.only.style.scss']
})
export class CallCenterOnlyPageComponent implements OnInit {
    public generalform: FormGroup;
    public pdacrewform: FormGroup;
    public cargoform: FormGroup;
    public otherform: FormGroup;
    enquirytypes: any[] = GlobalConstants.ExternalInputEnquiryType;
    enquiryType: number;
    externnalInputModelToSave: ExternalInputModel = new ExternalInputModel;
    currentIncidentId: number;
    currentDepartmentId: number;
    isSubmitted: boolean = false;
    speilEnglish: string;
    speilTagalog: string;
    public spielText: string;
    public isShowPage: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;

    constructor(private callcenteronlypageservice: CallCenterOnlyPageService,
        private toastrService: ToastrService,
        private globalState: GlobalStateService,
        private keyValueService: KeyValueService) { }

    ngOnInit() {
        this.enquiryType = 0;
        this.initializeForm();
        this.initiateEnquiryForms();
        this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));

        this.keyValueService.GetValue('SpielTextEnglish')
            .map(data => {
                return this.speilEnglish = data.Records[0].Value;
            })
            .flatMap(_ => this.keyValueService.GetValue('SpielTextTagalog'))
            .map(data => {
                return this.speilTagalog = data.Records[0].Value;
            })
            .subscribe(() => {

            });
    }

    incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }

    departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }

    initializeForm(): void {
        this.generalform = new FormGroup({
            EnquiryType: new FormControl('', [Validators.required]),
            CallerFirstName: new FormControl('', [Validators.required]),
            CallerLastName: new FormControl('', [Validators.required]),
            ContactNumber: new FormControl('', [Validators.required]),
            AlternateContactNumber: new FormControl(''),
            Relationship: new FormControl('')
        });
    }

    initiateEnquiryForms(): void {
        this.pdacrewform = new FormGroup({
            LastName: new FormControl('', [Validators.required]),
            FirstName: new FormControl('', [Validators.required]),
            Age: new FormControl(''), // new FormControl('', [Validators.required, NumberValidator.validate]),
            Nationality: new FormControl(''), // new FormControl('', [Validators.required]),
            PermanentAddress: new FormControl(''), // new FormControl('', [Validators.required]),
            FlightNumber: new FormControl(''), // new FormControl('', [Validators.required]),
            DepartedFrom: new FormControl('', [Validators.required]),
            TravellingTo: new FormControl('', [Validators.required]),
            TravellingWith: new FormControl(''),
            EnquiryReason: new FormControl('', [Validators.required]),
            KINFirstName: new FormControl(''),
            KINLastName: new FormControl(''),
            KINContactNumber: new FormControl(''),
            KINRelationShip: new FormControl(''),
            Query: new FormControl('', [Validators.required]),
            FinalDestination: new FormControl('', [Validators.required])
        });

        this.cargoform = new FormGroup({
            ShippersName: new FormControl('', [Validators.required]),
            ShippersAddress: new FormControl('', [Validators.required]),
            ShippersContactNumber: new FormControl('', [Validators.required]),
            ConsigneesName: new FormControl('', [Validators.required]),
            ConsigneesAddress: new FormControl('', [Validators.required]),
            ConsigneesContactNumber: new FormControl('', [Validators.required]),
            EnquiryReason: new FormControl('', [Validators.required]),
            Query: new FormControl('', [Validators.required])
        });

        this.otherform = new FormGroup({
            //   MediaAndOtherQueriesId: new FormControl('', [Validators.required]),
            source: new FormControl('', [Validators.required]),
            Query: new FormControl('', [Validators.required])
        });
    }

    save(): void {
        this.isSubmitted = true;
        if (this.generalform.valid && ((this.pdacrewform.valid && (this.enquiryType == 1 || this.enquiryType == 3)) ||
            (this.cargoform.valid && this.enquiryType == 2) || (this.otherform.valid && this.enquiryType >= 4))) {
            this.externnalInputModelToSave.Caller = new CallerModel();
            this.externnalInputModelToSave.IsCallRecieved = false;

            UtilityService.setModelFromFormGroup<CallerModel>(this.externnalInputModelToSave.Caller, this.generalform,
                x => x.ContactNumber, x => x.AlternateContactNumber, x => x.Relationship);

            this.externnalInputModelToSave.Caller.FirstName = this.generalform.controls["CallerFirstName"].value;
            this.externnalInputModelToSave.Caller.LastName = this.generalform.controls["CallerLastName"].value;
            this.externnalInputModelToSave.Caller.IsNok = false;
            this.externnalInputModelToSave.EnquiryType = this.enquirytypes.find(x => x.value == this.enquiryType).caption;
            this.externnalInputModelToSave.IncidentId = this.currentIncidentId;

            if (this.enquiryType == 1 || this.enquiryType == 3) {
                this.externnalInputModelToSave.PDAEnquiry = new PDAEnquiryModel();
                UtilityService.setModelFromFormGroup<PDAEnquiryModel>(this.externnalInputModelToSave.PDAEnquiry, this.pdacrewform,
                    x => x.DepartedFrom, x => x.KINContactNumber, x => x.FinalDestination, x => x.FirstName, x => x.FlightNumber, x => x.EnquiryReason, x => x.KINFirstName,
                    x => x.KINLastName, x => x.KINRelationShip, x => x.LastName, x => x.Nationality, x => x.Age, x => x.PermanentAddress,
                    x => x.TravellingWith, x => x.TravellingTo, x => x.Query);
                this.externnalInputModelToSave.PDAEnquiry.IncidentId = this.currentIncidentId;
                this.externnalInputModelToSave.PDAEnquiry.Age = +this.externnalInputModelToSave.PDAEnquiry.Age;
            }

            if (this.enquiryType == 2) {
                this.externnalInputModelToSave.CargoEnquiry = new CargoEnquiryModel();
                UtilityService.setModelFromFormGroup<CargoEnquiryModel>(this.externnalInputModelToSave.CargoEnquiry, this.cargoform,
                    x => x.ConsigneesAddress, x => x.ConsigneesContactNumber, x => x.ConsigneesName, x => x.EnquiryReason,
                    x => x.ShippersAddress, x => x.ShippersContactNumber, x => x.ShippersName, x => x.Query);
                this.externnalInputModelToSave.CargoEnquiry.IncidentId = this.currentIncidentId;
            }

            if (this.enquiryType >= 4) {
                this.externnalInputModelToSave.MediaAndOtherQuery = new MediaAndOtherQueryModel();
                UtilityService.setModelFromFormGroup<MediaAndOtherQueryModel>(this.externnalInputModelToSave.MediaAndOtherQuery, this.otherform,
                    x => x.source, x => x.Query);
                this.externnalInputModelToSave.MediaAndOtherQuery.IncidentId = this.currentIncidentId;
            }

            this.callcenteronlypageservice.Create(this.externnalInputModelToSave)
                .subscribe((response: ExternalInputModel) => {
                    this.toastrService.success('Enquiry saved successfully.');
                    this.enquiryType = 0;
                    this.initializeForm();
                    this.initiateEnquiryForms();
                    this.isSubmitted = false;
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    enquiryChanged(): void {
        this.enquiryType = +this.generalform.controls["EnquiryType"].value;
        this.initiateEnquiryForms();
    }
}
