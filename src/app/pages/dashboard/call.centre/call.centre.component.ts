import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';


import { ResponseModel, DataExchangeService, AutocompleteComponent, KeyValue, GlobalConstants } from '../../../shared';
import { CallerModel, EnquiryModel, EnquiryService, CommunicationLogModel } from './components';
import { AffectedPeopleService, AffectedPeopleToView } from '../affected.people';
import { AffectedObjectsService } from '../affected.objects';
import { InvolvedPartyModel } from '../InvolvedParty';


@Component({
    selector: 'call-centre-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/call.centre.view.html'
})

export class EnquiryComponent {
    constructor(private affectedPeopleService: AffectedPeopleService, private affectedObjectsService: AffectedObjectsService) { };
    public form: FormGroup;
    enquiryTypes: Object = GlobalConstants.EnquiryType;
    enquiryType: number;
    enquiry: EnquiryModel = new EnquiryModel();
    caller: CallerModel = new CallerModel();
    passengers: Array<KeyValue> = [];
    awbs: Array<KeyValue> = [];
    crews: Array<KeyValue> = [];
    affectedPeople: AffectedPeopleToView[];
    communicationLog: CommunicationLogModel = new CommunicationLogModel();
    date: Date = new Date();

    onNotifyPassenger(message: KeyValue): void {
        this.enquiry.AffectedPersonId = message.Value;
        this.enquiry.AffectedObjectId = 0;
        this.communicationLog.AffectedPersonId = message.Value;
        delete this.communicationLog.AffectedObjectId;
    };
    onNotifyCrew(message: KeyValue): void {
        this.enquiry.AffectedPersonId = message.Value;
        this.enquiry.AffectedObjectId = 0;
        this.communicationLog.AffectedPersonId = message.Value;
        delete this.communicationLog.AffectedObjectId;
    };
    onNotifyCargo(message: KeyValue): void {
        this.enquiry.AffectedObjectId = message.Value;
        this.enquiry.AffectedPersonId = 0;
        this.communicationLog.AffectedObjectId = message.Value;
        delete this.communicationLog.AffectedPersonId;
    };
    iscrew(item: AffectedPeopleToView) {
        return item.IsCrew == true;
    };
    ispassenger(item: AffectedPeopleToView) {
        return item.IsCrew == false;
    };
    getPassengersCrews() {
        this.affectedPeopleService.GetFilterByIncidentId()
            .subscribe((response: ResponseModel<InvolvedPartyModel>) => {
                this.affectedPeople = this.affectedPeopleService.FlattenData(response.Records[0]);
                let passengerModels = this.affectedPeople.filter(this.ispassenger);
                let crewModels = this.affectedPeople.filter(this.iscrew);
                for (let affectedPerson of passengerModels) {
                    this.passengers.push(new KeyValue((affectedPerson.PassengerName || affectedPerson.CrewName), affectedPerson.AffectedPersonId));
                }
                for (let affectedPerson of crewModels) {
                    this.crews.push(new KeyValue((affectedPerson.PassengerName || affectedPerson.CrewName), affectedPerson.AffectedPersonId));
                }
            }, (error: any) => {
                console.log("error:  " + error);
            });
    };
    getCargo() {
        this.affectedObjectsService.GetFilterByIncidentId()
            .subscribe((response: ResponseModel<InvolvedPartyModel>) => {
                let affectedObjects = this.affectedObjectsService.FlattenData(response.Records[0]);
                for (let affectedObject of affectedObjects) {
                    this.awbs.push(new KeyValue(affectedObject.AWB, affectedObject.AffectedObjectId));
                }
            }, (error: any) => {
                console.log("error:  " + error);
            });

    };
    setCallerModel() {
        this.caller.ActiveFlag = 'Active';
        this.caller.AlternateContactNumber = this.form.controls['AlterNateContactNo'].value;
        this.caller.CallerName = this.form.controls['CallerName'].value;
        this.caller.ContactNumber = this.form.controls['ContactNo'].value;
        this.caller.CreatedBy = 1;
        this.caller.CreatedOn = this.date;
        this.caller.Relationship = this.form.controls['Relationship'].value;
    }

    SetCommunicationLog() {
        this.communicationLog.Queries
        this.communicationLog.Answers = this.form.controls['DiscussionNote'].value + " Caller:"
            + this.caller.CallerName + " Contact Number:" + this.caller.ContactNumber;
        this.communicationLog.RequesterName = "UserName";
        this.communicationLog.RequesterDepartment = "ERM";
        this.communicationLog.ActiveFlag = 'Active';
        this.communicationLog.CreatedBy = 1;
        this.communicationLog.CreatedOn = this.date;
    }

    save() {
        this.setCallerModel();
        this.SetCommunicationLog();
        this.enquiry.ActiveFlag = 'Active';
        this.enquiry.CreatedBy = 1;
        this.enquiry.CreatedOn = this.date;
        this.enquiry.EnquiryType = this.form.controls['EnquiryTypeName'].value;
        this.enquiry.IncidentId = 88;
        this.enquiry.IsAdminRequest = this.form.controls['AdminRequest'].value;
        this.enquiry.IsCallBack = this.form.controls['Callback'].value;
        this.enquiry.IsTravelRequest = this.form.controls['TravelRequest'].value;



    };
    ngOnInit(): any {
        this.form = new FormGroup({
            EnquiryId: new FormControl(0),
            EnquiryTypeName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            CallerName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            ContactNo: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            AlterNateContactNo: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            DiscussionNote: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            Relationship: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            Callback: new FormControl(false),
            TravelRequest: new FormControl(false),
            AdminRequest: new FormControl(false)
        });
        this.getPassengersCrews();
        this.getCargo();
        this.enquiry.EnquiryType = this.enquiryTypes[0].value;
        console.log("Call centre");

    };

}