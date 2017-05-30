import { NgModule } from '@angular/core';

import { BaseModel } from '../../../../shared';

export class RAGScaleModel extends BaseModel {
    public RagId: number;
    public RagName: string;
    public StartingPoint: number;
    public EndingPoint: number;
    public StyleCode: string;
    public AppliedModule: string;

    constructor() {
        super();
        this.RagId = 0;
        this.RagName = '';
        this.StartingPoint =0;
        this.EndingPoint = 0;
        this.StyleCode = '';
        this.AppliedModule = '';
    }
}

