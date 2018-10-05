import {
    Component, Output, ViewEncapsulation,
    OnInit, AfterViewInit, EventEmitter, ElementRef
} from '@angular/core';
import {
    FormGroup, FormBuilder,
    FormControl, Validators, ValidationErrors
} from '@angular/forms';
import { UtilityService } from '../../../shared/services';
import { ChangePasswordModel } from './auth.model';
import { AccountResponse } from '../../../shared/models';
import { ChangePasswordService } from './change.password.service';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

@Component({
    selector: 'change-password',
    encapsulation: ViewEncapsulation.None,
    providers: [ChangePasswordService],
    templateUrl: '../views/change.password.view.html',
    styleUrls: ['../styles/login.style.scss']
})
export class ChangePasswordComponent implements OnInit, AfterViewInit {
    @Output() closeHandler: EventEmitter<any> = new EventEmitter<any>();
    @Output() successMessageInvoker: EventEmitter<any> = new EventEmitter<any>();

    public changePasswordForm: FormGroup;
    public submitted: boolean = false;
    public errorMessage: string = '';

    /**
     *Creates an instance of ChangePasswordComponent.
     * @param {ElementRef} elementRef
     * @param {Router} router
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     * @param {ChangePasswordService} changePasswordService
     * @memberof ChangePasswordComponent
     */
    constructor(private elementRef: ElementRef,
        private router: Router,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private changePasswordService: ChangePasswordService) { }

    public ngOnInit(): void {
        this.changePasswordForm = this.setChangePasswordForm();
    }

    public ngAfterViewInit(): void {
        const $self: JQuery = jQuery(this.elementRef.nativeElement);

        $self.find('.input-group-addon').on('mousedown mouseup', (event) => {
            debugger;
            const $btn: JQuery = $(event.currentTarget);
            const $input: JQuery = $btn.siblings('input');

            if ($input.text() !== 'empty') {
                $btn.find('i').toggleClass('fa-eye fa-eye-slash');
                if ($btn.find('i').hasClass('fa-eye')) {
                    $input.attr('type', 'text');
                } else {
                    $input.attr('type', 'password');
                }
            }
        });
    }

    public onCancelClick($event): void {
        this.changePasswordForm.reset();
        this.router.navigate(['login']);
    }

    public onSubmit(changePasswordModel: ChangePasswordModel): void {
        this.submitted = true;
        this.errorMessage = '';
        this.getFormValidationErrors();

        if (this.changePasswordForm.valid) {
            this.changePasswordService.ChangePassword(changePasswordModel)
                .subscribe((response: AccountResponse) => {
                    if (response) {
                        if (response.Code === 3001) {
                            this.changePasswordForm.reset();
                            this.toastrService.success('Password has been changed successfully. Redirecting to login for sign in again',
                                'Sign In', this.toastrConfig);
                            UtilityService.RemoveFromSession('IsChangPasswordRequired');
                            this.router.navigate(['login']);
                        } else {
                            this.errorMessage = response.Message;
                        }
                    }
                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
                });
        }
    }

    compareValidator(control: FormControl): any {
        if (this.changePasswordForm) {
            return control.value === this.changePasswordForm.get('NewPassword').value ? null : { notSame: true };
        }
    }

    ValidatePassword(control: FormControl) {
        const PASSWORD_REGEXP: RegExp = new RegExp("^(?!.*[\s])(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$");
        const password: string = control.value;

        return PASSWORD_REGEXP.test(password) ? null : {
            ValidatePassword: {
                valid: true
            }
        };
    }

    private setChangePasswordForm(changePasswordModel?: ChangePasswordModel): FormGroup {
        this.compareValidator = this.compareValidator.bind(this);
        const formGroup: FormGroup = new FormGroup({
            SecurityQuestion: new FormControl(changePasswordModel ? changePasswordModel.SecurityQuestion : '', [Validators.required]),
            SecurityAnswer: new FormControl(changePasswordModel ? changePasswordModel.SecurityAnswer : '', [Validators.required]),
            OldPassword: new FormControl(changePasswordModel ? changePasswordModel.OldPassword : '', [Validators.required]),
            NewPassword: new FormControl(changePasswordModel ? changePasswordModel.NewPassword : '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(20),
                    Validators.pattern(/^(?!.*[\s])(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)
                ]),
            ConfirmPassword: new FormControl(changePasswordModel ? changePasswordModel.ConfirmPassword : '',
                [
                    Validators.required,
                    this.compareValidator
                ]),
        });
        return formGroup;
    }

    private getFormValidationErrors(): void {
        Object.keys(this.changePasswordForm.controls).forEach(key => {

            const controlErrors: ValidationErrors = this.changePasswordForm.get(key).errors;
            if (controlErrors != null) {
                Object.keys(controlErrors).forEach(keyError => {
                    console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                });
            }
        });
    }
}