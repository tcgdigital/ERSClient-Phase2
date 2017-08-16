import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';

export class QuickLinkModel extends BaseModel {
    public QuickLinkId: number;
    public QuickLinkName: string;
    public QuickLinkURL: string;
    public UploadURL: string;
    public Active: boolean;

    constructor() {
        super();
        this.QuickLinkId = 0;
        // this.QuickLinkName = '';
        // this.QuickLinkURL = '';
        this.UploadURL = '';
        // this.Active = false;
    }
}