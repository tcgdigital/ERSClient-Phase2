import { Component, ViewEncapsulation, OnInit, ElementRef } from '@angular/core';

import { DepartmentModel } from '../masterdata/department/components/department.model';
import { UserProfileModel } from '../masterdata/userprofile/components/userprofile.model';
import { NotifyPeopleService } from './components/notifypeople.service';
import { NotifyPeopleModel } from './components/notifypeople.model';
import { ResponseModel, DataExchangeService, AutocompleteComponent, KeyValue } from '../../shared';

@Component({
    selector: 'notify-people-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/notifypeople.view.html',
    styleUrls: ['./styles/notifypeople.style.scss']
})
export class NotifyPeopleComponent implements OnInit {
    userProfileItems: UserProfileModel[] = [];
    departments: DepartmentModel[] = [];
    notifucationModel: NotifyPeopleModel[] = [];
    private $document: JQuery;
    private $tree: JQuery;

    constructor(private notifyPeopleService: NotifyPeopleService, private elementRef: ElementRef) { };

    ngOnInit(): any {
        this.notifucationModel = this.notifyPeopleService.GetDepartmentSubDepartmentUser(1);
        console.log(this.notifucationModel);
    }

    public ngAfterContentInit(): void {
        let $tree: JQuery = jQuery(this.elementRef.nativeElement).find('#tree');
        $tree.tree({
            primaryKey: 'id',
            uiLibrary: 'bootstrap',
            iconsLibrary: 'fontawesome',
            dataSource: 'http://localhost:63490/Locations/Get',
            checkboxes: true
        });


    }
}