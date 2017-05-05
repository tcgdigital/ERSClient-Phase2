import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule} from 'ng2-bootstrap/modal';


import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PagesRouting } from './pages.routing';
import { MasterDateModule } from './masterdata';
import { IncidentModule } from './incident';
import { ContactInfoComponent } from './shared.components/contact.info';

// import { IncidentModule } from './incident';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        IncidentModule,
        MasterDateModule,
        ToastrModule,
        PagesRouting,
        ModalModule
        
        
    ],
    declarations: [PagesComponent, ContactInfoComponent]
})
export class PagesModule {
}