import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import {
    FormGroup, FormControl, FormBuilder, Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { KeyValueService, KeyValueModel } from '../../../shared';

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
    private speilEnglish : KeyValueModel;
    private speilTagalog : KeyValueModel;

    constructor(private keyValueService: KeyValueService, 
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
    ) { }
    
    public ngOnInit() 
    { 
        this.initializeForm();
        this.getSpiel();
    }

    initializeForm(): void {
        
        this.generalform = new FormGroup({
            SpielType: new FormControl('', [Validators.required]),
            SpielText: new FormControl('', [Validators.required])
        });

    }

    public getSpiel(): void{
        this.submitted = false;
        this.keyValueService.GetValue('SpielTextEnglish')
        .map(data=>{
           return this.speilEnglish = data.Records[0];
        })
        .flatMap(_=>this.keyValueService.GetValue('SpielTextTagalog'))
        .map(data=>{
           return this.speilTagalog = data.Records[0];
        }).subscribe(() => {
                
        }, (error: any) => {
            console.log(`Error: ${error}`);
        });
    }

    public spielChanged() : void{
        
        if(this.generalform.controls["SpielType"].value == "SpielTextEnglish")
        {
            this.generalform.controls["SpielText"].setValue(this.speilEnglish.Value);
        }
        else if(this.generalform.controls["SpielType"].value == "SpielTextTagalog")
        {
            this.generalform.controls["SpielText"].setValue(this.speilTagalog.Value);
        }
        else
        {
            //this.generalform.get('SpielText').setValue('');
            this.generalform.controls["SpielText"].setValue("");
        }
    }

    public spielSave() : void{
        
        if(this.generalform.valid)
        {
            let KeyVal: KeyValueModel = null;
            if(this.generalform.controls["SpielType"].value == "SpielTextEnglish")
            {
                this.speilEnglish.Value = this.generalform.controls["SpielText"].value;
                KeyVal = this.speilEnglish;
            }
            else if(this.generalform.controls["SpielType"].value == "SpielTextTagalog")
            {
                this.speilTagalog.Value = this.generalform.controls["SpielText"].value;
                KeyVal = this.speilTagalog;
            }

            if(KeyVal != null)
            {
                this.keyValueService.Update(KeyVal, KeyVal.KeyValueId).subscribe(() => {
                    this.getSpiel();
                    this.toastrService.success('Spile Text Saved successfully.', 'Success', this.toastrConfig);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                }
                );
            }
        }
        else
        {
            this.submitted = true;
        }
        
    }

    
}