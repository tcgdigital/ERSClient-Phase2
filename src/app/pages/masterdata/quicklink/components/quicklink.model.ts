import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';

export class QuickLinkModel extends BaseModel {
    public QuickLinkId: number;
    public QuickLinkName: string;
    public QuickLinkURL: string;
    public Active: boolean;
}