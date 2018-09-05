import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';
import { QuickLinkGroupModel } from '../../quicklinkgroup';


export class QuickLinkModel extends BaseModel {
    public QuickLinkId: number;
    public QuickLinkName: string;
    public QuickLinkURL: string;
    public UploadURL: string;
    public Active: boolean;
    public QuickLinkGroupId?: number;
    public QuickLinkGroup: QuickLinkGroupModel;

    constructor() {
        super();
        this.QuickLinkId = 0;
        // this.QuickLinkName = '';
        // this.QuickLinkURL = '';
        this.UploadURL = '';
        // this.Active = false;
    }
}