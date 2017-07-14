import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';
import { IncidentModel } from "../../../incident/components/incident.model";

export class OrganizationModel extends BaseModel {
    public OrganizationId: number;
    public OrganizationCode: string;
    public OrganizationName: string;
    public OrganizationLogoPath: string;
    public PhoneNumber: string;
    public FaxNumber: string;
    public Email: string;
    public WebURL: string;

    public Incident?: IncidentModel[];


    constructor() {
        super();
        this.OrganizationId = 0;
        this.OrganizationCode = '';
        this.OrganizationName = '';
        this.OrganizationLogoPath = '';
        this.PhoneNumber = '';
        this.FaxNumber = '';
        this.Email = '';
        this.WebURL = '';
    }
}