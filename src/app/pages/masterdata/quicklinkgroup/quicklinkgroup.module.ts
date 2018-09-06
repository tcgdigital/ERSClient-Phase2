import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickLinkGroupComponent, QuickLinkGroupService } from '.';
import { SharedModule } from '../../../shared';
import { QuickLinkGroupRouting } from './quicklinkgroup.routing';


@NgModule({
    imports: [
        CommonModule,
        SharedModule
        // QuickLinkGroupRouting
    ],
    exports: [
        QuickLinkGroupComponent
    ],
    declarations: [
        QuickLinkGroupComponent,
    ],
    providers: [
        QuickLinkGroupService
    ]
})
export class QuickLinkGroupModule { }