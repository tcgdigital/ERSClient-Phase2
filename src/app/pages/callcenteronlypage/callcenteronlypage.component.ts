import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    FormGroup, FormControl, FormBuilder, Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { GlobalConstants, UtilityService,GlobalStateService, KeyValue, ResponseModel } from "../../shared";
import { ExternalInputModel, PDAEnquiryModel, CargoEnquiryModel, MediaAndOtherQueryModel } from "./component/callcenteronlypage.model";
import { CallCenterOnlyPageService } from "./component/callcenteronlypage.service";
import { CallerModel } from "../shared.components/caller";

@Component({
    selector: 'login',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/callcenteronlypage.view.html'
})
export class CallCenterOnlyPageComponent implements OnInit {
    public form: FormGroup;
    enquirytypes: any[] = GlobalConstants.ExternalInputEnquiryType;
    enquiryType: number;
    externnalInputModelToSave: ExternalInputModel = new ExternalInputModel;
    currentIncident : number;

    constructor(formBuilder: FormBuilder, private callcenteronlypageservice: CallCenterOnlyPageService, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig, private globalState: GlobalStateService) { }

    ngOnInit() {
        this.enquiryType = 0;
        this.form = this.initializeForm();
        this.currentIncident = +UtilityService.GetFromSession("CurrentIncidentId");
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
    }

    incidentChangeHandler(incident: KeyValue): void {
		this.currentIncident = incident.Value;
    }

    initializeForm(): FormGroup {
        return new FormGroup({
            EnquiryType: new FormControl(0),
            CallerFirstName: new FormControl('', [Validators.required]),
            CallerLastName: new FormControl('', [Validators.required]),
            ContactNumber: new FormControl('', [Validators.required]),
            AlternateContactNumber: new FormControl('', [Validators.required]),
            Relationship: new FormControl('', [Validators.required]),
            ShippersName: new FormControl('', [Validators.required]),
            ShippersAddress: new FormControl('', [Validators.required]),
            ShippersContactNumber: new FormControl('', [Validators.required]),
            ConsigneesName: new FormControl('', [Validators.required]),
            ConsigneesAddress: new FormControl('', [Validators.required]),
            ConsigneesContactNumber: new FormControl('', [Validators.required]),
            EnquiryReason: new FormControl('', [Validators.required]),
            Query: new FormControl('', [Validators.required]),
            LastName: new FormControl('', [Validators.required]),
            FirstName: new FormControl('', [Validators.required]),
            Age: new FormControl(0, [Validators.required]),
            Nationality: new FormControl('', [Validators.required]),
            PermanentAddress: new FormControl('', [Validators.required]),
            FlightNumber: new FormControl('', [Validators.required]),
            DepartedFrom: new FormControl('', [Validators.required]),
            TravellingTo: new FormControl('', [Validators.required]),
            TravellingWith: new FormControl('', [Validators.required]),
            KINFirstName: new FormControl('', [Validators.required]),
            KINLastName: new FormControl('', [Validators.required]),
            KINContactNumber: new FormControl('', [Validators.required]),
            KINRelationShip: new FormControl('', [Validators.required]),
            MediaAndOtherQueriesId: new FormControl('', [Validators.required]),
            source: new FormControl('', [Validators.required])
        });
    }

    save(): void {
        this.externnalInputModelToSave.Caller = new CallerModel();
        this.externnalInputModelToSave.IsCallRecieved = false;
        UtilityService.setModelFromFormGroup<CallerModel>(this.externnalInputModelToSave.Caller, this.form,
            x => x.ContactNumber, x => x.AlternateContactNumber, x => x.Relationship);
            this.externnalInputModelToSave.Caller.FirstName= this.form.controls["CallerFirstName"].value;
            this.externnalInputModelToSave.Caller.LastName= this.form.controls["CallerLastName"].value;
            this.externnalInputModelToSave.Caller.IsNok = false;
            this.externnalInputModelToSave.EnquiryType = this.enquirytypes.find(x=> x.value == this.enquiryType).caption;
            this.externnalInputModelToSave.IncidentId = this.currentIncident;
        if (this.enquiryType == 1 || this.enquiryType == 3) {
            this.externnalInputModelToSave.PDAEnquiry = new PDAEnquiryModel();
            UtilityService.setModelFromFormGroup<PDAEnquiryModel>(this.externnalInputModelToSave.PDAEnquiry, this.form,
                x => x.DepartedFrom, x => x.KINContactNumber, x => x.FirstName, x => x.FlightNumber, x => x.EnquiryReason, x => x.KINFirstName,
                x => x.KINLastName, x => x.KINRelationShip, x => x.LastName, x => x.Nationality, x => x.Age, x => x.PermanentAddress,
                x => x.Query, x => x.TravellingWith, x => x.TravellingTo);
            this.externnalInputModelToSave.PDAEnquiry.IncidentId = this.currentIncident;
            this.externnalInputModelToSave.PDAEnquiry.Age = +this.externnalInputModelToSave.PDAEnquiry.Age;
        }
        if (this.enquiryType == 2) {
            this.externnalInputModelToSave.CargoEnquiry = new CargoEnquiryModel();
            UtilityService.setModelFromFormGroup<CargoEnquiryModel>(this.externnalInputModelToSave.CargoEnquiry, this.form,
                x => x.ConsigneesAddress, x => x.ConsigneesContactNumber, x => x.ConsigneesName, x => x.EnquiryReason,
                x => x.Query, x => x.ShippersAddress, x => x.ShippersContactNumber, x => x.ShippersName);
            this.externnalInputModelToSave.CargoEnquiry.IncidentId = this.currentIncident;
        }
        if (this.enquiryType >= 4) {
            this.externnalInputModelToSave.MediaAndOtherQuery = new MediaAndOtherQueryModel();
            UtilityService.setModelFromFormGroup<MediaAndOtherQueryModel>(this.externnalInputModelToSave.MediaAndOtherQuery, this.form,
                x => x.Query, x => x.source);
            this.externnalInputModelToSave.MediaAndOtherQuery.IncidentId = this.currentIncident;
        }
        this.callcenteronlypageservice.Create(this.externnalInputModelToSave)
            .subscribe((response: ExternalInputModel) => {
                this.toastrService.success('Enquiry saved successfully.');
                this.form = this.initializeForm();
            });
    }
}
