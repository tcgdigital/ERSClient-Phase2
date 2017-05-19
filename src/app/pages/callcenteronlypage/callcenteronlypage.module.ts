import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CallCenterOnlyPageComponent } from "./callcenteronlypage.component";
import { CallCenterPageRouting } from "./callcenteronlypage.routing";
import { CallCenterOnlyPageService } from "./component/callcenteronlypage.service";
import { SharedModule } from '../../shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        CallCenterPageRouting
    ],
    declarations: [
        CallCenterOnlyPageComponent
    ],
    providers: [
       CallCenterOnlyPageService
    ]
})
export class CallCenterOnlyPageModule {
}