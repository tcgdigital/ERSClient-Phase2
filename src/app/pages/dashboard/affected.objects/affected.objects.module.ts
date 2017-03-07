import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { AffectedObjectsComponent } from './affected.objects.component';
import { AffectedObjectsRouting } from './affected.objects.routing';
import { AffectedObjectsService, AffectedObjectsListComponent, AffectedObjectsVerificationComponent} from './components';
import { DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        MdCheckboxModule,
        AffectedObjectsRouting
    ],
    declarations: [
        AffectedObjectsComponent,
        AffectedObjectsListComponent,
        AffectedObjectsVerificationComponent
    ],
    providers: [
        AffectedObjectsService,
        DataExchangeService
    ]
})
export class AffectedObjectsModule { }