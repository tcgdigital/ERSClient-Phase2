import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import {
    FormGroup, FormControl, FormBuilder, Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { KeyValueService, KeyValueModel, ResponseModel } from '../../../shared';

@Component({
    selector: 'dept-main',
    encapsulation: ViewEncapsulation.None,
    providers: [KeyValueService],
    templateUrl: './views/spiel.entry.view.html',
    styleUrls: ['./styles/spiel.style.scss']
})
export class SpileComponent implements OnInit {
    public data: any;
    public generalform: FormGroup;
    public submitted: boolean = false;
    public activeKeyValues: KeyValueModel[] = [];
    private updatedKeyValue: KeyValueModel;

    constructor(private keyValueService: KeyValueService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
    ) { }

    public ngOnInit() {
        this.updatedKeyValue=new KeyValueModel();
        this.getAllActiveKeyValues();
        this.initializeForm();
    }

    getAllActiveKeyValues(): void {
        this.keyValueService.GetAll()
            .subscribe((response: ResponseModel<KeyValueModel>) => {
                this.activeKeyValues = response.Records;

                this.generalform.controls["SpielText"].setValue('');

            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    initializeForm(): void {

        this.generalform = new FormGroup({
            SpielType: new FormControl('', [Validators.required]),
            SpielText: new FormControl('', [Validators.required])
        });

    }

    

    keyvalueChange(Key: string, activeKeyValues: KeyValueModel[]): void {
        if (Key != '') {
            const activeOrganization: KeyValueModel = activeKeyValues
                .find((x: KeyValueModel) => x.Key === Key);

            this.generalform.controls["SpielText"].setValue(activeOrganization.Value);
        }
        else {
            this.generalform.controls["SpielText"].setValue('');
        }

    }

   

    public spielSave(): void {
        if (this.generalform.valid) {
            let KeyVal: KeyValueModel = null;
            
            const activeOrganization: KeyValueModel = this.activeKeyValues
            .find((x: KeyValueModel) => x.Key === this.generalform.controls["SpielType"].value);
            
            this.updatedKeyValue.Value = this.generalform.controls["SpielText"].value;
            KeyVal = this.updatedKeyValue;
            KeyVal.KeyValueId=activeOrganization.KeyValueId;
            if (KeyVal != null) {
                delete KeyVal.ActiveFlag;
                delete KeyVal.CreatedBy;
                delete KeyVal.CreatedOn;
                delete KeyVal.Description;
                delete KeyVal.Key;
                this.keyValueService.Update(KeyVal, KeyVal.KeyValueId).subscribe(() => {
                    this.initializeForm();
                    this.getAllActiveKeyValues();
                    this.toastrService.success('Spiel Text Saved successfully.', 'Success', this.toastrConfig);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                }
                );
            }
        }
        else {
            this.submitted = true;
        }

    }


}