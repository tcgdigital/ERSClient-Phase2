import { NgModule } from '@angular/core';

import {
    InvolvePartyModel,
    AffectedPeopleModel,
    AffectedObjectModel
} from '../../../shared.components';
import { BaseModel, GlobalConstants } from '../../../../shared';

export class AffectedModel extends BaseModel {
    public AffectedId: number;
    public InvolvedPartyId: number;
    public Severity?: string;

    public Active: boolean;

    public InvolvedParty: InvolvePartyModel;

    public AffectedPeople?: AffectedPeopleModel[];
    public AffectedObjects?: AffectedObjectModel[];

    constructor() {
        super();
        this.AffectedId = 0;
        this.InvolvedPartyId = 0;
        this.Severity = '';
        this.Active = false;
    }
}