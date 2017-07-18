import { NgModule } from '@angular/core';
import { BaseModel, KeyValue } from '../../../shared';
import { EmergencyTypeModel } from '../../masterdata/emergencytype';
import { DepartmentModel } from '../../masterdata/department';
import { InvolvePartyModel, OrganizationModel } from '../../shared.components';

export class IncidentModel extends BaseModel {
    public IncidentId: number;
    public IsDrill: boolean;
    public EmergencyTypeId: number;
    public IncidentStatus: string;
    public EmergencyName: string;
    //public AlertMessage: string;
    public Description: string;
    public ClosureNote: string;
    public EmergencyDate: Date;
    public Severity?: string;
    public EmergencyLocation: string;
    public EmergencyCountry: string;
    public OffSetLocation: string;

    public WhatHappend: string;
    public WhereHappend: string;
    public OtherConfirmationInformation: string;
    public ReportedDate: Date;

    public IsSubmitted: boolean;
    public IsSaved: boolean;
    public Remarks: string;
    //public AirportInCharge: string;
    public OrganizationId: number;
    //public CrisisReporterIdentity: string;
    public Latitude: string;
    public Longitude: string;
    public SourceInformation: string;
    public ReportedByName: string;
    public ReportedByAddress: string;
    public ContactOfWitness: string;
    public SenderOfCrisisInformation: string;
    public BorrowedIncident?: number;


    public ClosedBy?: number;
    public ClosedOn?: Date;
    public ReOpenBy?: number;
    public ReOpenOn?: Date;
    public ReClosedBy?: number;
    public ReClosedOn?: Date;
    public SubmittedBy?: number;
    public SubmittedOn?: Date;
    public SavedBy?: number;
    public SavedOn?: Date;
    public DepartmentId: number;
    public isReopen: boolean;

    public EmergencyType: EmergencyTypeModel;
    public Organization: OrganizationModel;
    public Department: DepartmentModel;

    public InvolvedParties?: InvolvePartyModel[];


    constructor() {
        super();
        this.IncidentId = 0;
        this.IsDrill = false;
        this.EmergencyTypeId = 0;

        this.IncidentStatus = '';
        this.EmergencyName = '';
        //this.AlertMessage = '';
        this.Description = '';
        this.ClosureNote = '';
        this.EmergencyDate = new Date();
        this.Severity = null;
        this.EmergencyLocation = '';
        this.EmergencyCountry = '';
        this.WhatHappend = '';
        this.WhereHappend = '';
        this.OtherConfirmationInformation = '';
        this.ReportedDate = new Date();

        this.IsSubmitted = false;
        this.IsSaved = false;
        this.Remarks = '';
        //this.AirportInCharge = '';
        this.OrganizationId = 0;
        //this.CrisisReporterIdentity = '';

        this.SourceInformation = '';
        this.ReportedByName = '';
        this.ReportedByAddress = '';
        this.ContactOfWitness = '';
        this.SenderOfCrisisInformation = '';
        this.BorrowedIncident = null;

        this.ClosedBy = null;
        this.ClosedOn = null;
        this.ReOpenBy = null;
        this.ReOpenOn = null;
        this.ReClosedBy = null;
        this.ReClosedOn = null;
        this.SubmittedBy = null;
        this.SubmittedOn = null;
        this.SavedBy = null;
        this.SavedOn = null;
        this.DepartmentId = 0;
    }
}

