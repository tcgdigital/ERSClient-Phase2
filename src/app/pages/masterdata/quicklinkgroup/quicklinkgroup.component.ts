import {
    Component, OnInit, ViewEncapsulation,
    Output, EventEmitter, ViewChild, Input
} from '@angular/core';
import { QuickLinkGroupModel } from './quicklinkgroup.model';
import { KeyValue, AutocompleteComponent } from '../../../shared';
import { QuickLinkGroupService } from './quicklinkgroup.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'quick-link-group',
    encapsulation: ViewEncapsulation.None,
    template: `
    <div class="row">
        <div class="col-sm-8 form-group">
            <label *ngIf="caption != ''">{{caption}}</label>
            <autocomplete #quickLinkGroup [items]="quickLinkGroups" (notify)="onNotify($event)" (InvokeAutoCompleteReset)="invokeReset();"></autocomplete>
        </div>
        <div class="col-sm-2 pl-md-0" style="margin-top: 19px;" *ngIf="enableAddButton">
            <button class="btn btn-primary" type="button" (click)="onAddGroupClick()">Add Group</button>
        </div>
    </div>`
})
export class QuickLinkGroupComponent implements OnInit {
    @ViewChild('quickLinkGroup') autocompleteComponent: AutocompleteComponent;

    @Output() notifyOnChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();
    @Output() notifyOnReset: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();
    @Output() notifyOnInsertion: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    @Input() enableAddButton: boolean = false;
    @Input() caption: string = '';

    public quickLinkGroups: Array<KeyValue> = new Array<KeyValue>();
    quickLinkGroup: QuickLinkGroupModel;

    constructor(private quickLinkGroupService: QuickLinkGroupService,
        private toastrService: ToastrService) {
    }

    public ngOnInit(): void {
        this.quickLinkGroupService.GetAll()
            .subscribe(x => {
                this.quickLinkGroups = x.Records
                    .map(qg => new KeyValue(qg.GroupName, qg.QuickLinkGroupId))
            });
    }

    public getCurrentText(): string {
        return this.autocompleteComponent.query;
    }

    public setInitialValue(selectedItem: KeyValue): void {
        this.autocompleteComponent.select(selectedItem);
    }

    public invokeReset(): void {
        this.notifyOnReset.emit();
    }

    public onNotify(message: KeyValue): void {
        this.notifyOnChange.emit(message);
    }

    public onAddGroupClick(): void {
        let groupName = this.autocompleteComponent.query;
        console.log(`New Group Name: ${groupName}`);
        this.InsertQuicklinkGroup(groupName);
    }

    private InsertQuicklinkGroup(groupName: string): void {
        this.quickLinkGroup = new QuickLinkGroupModel();
        this.quickLinkGroup.GroupName = groupName;

        this.quickLinkGroupService.Create(this.quickLinkGroup)
            .subscribe((response: QuickLinkGroupModel) => {
                this.toastrService.success('Quick link group saved Successfully.', 'Success');
                let newlyAddedGroup = new KeyValue(response.GroupName, response.QuickLinkGroupId);
                this.autocompleteComponent.items.unshift(newlyAddedGroup);
                this.notifyOnInsertion.emit(newlyAddedGroup);
            }, (error: any) => {
                console.log(`Error: ${error}`);
                this.toastrService.error(error.message, 'Error');
            });
    }
}