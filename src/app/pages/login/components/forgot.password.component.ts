import { Component, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { ForgotPasswordService } from './forgot.password.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalConstants } from '../../../shared/constants/constants';
import { ForgotPasswordModel } from './auth.model';
import { AccountResponse } from '../../../shared/models';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'forgot-password',
    templateUrl: '../views/forgot.password.view.html',
    styleUrls: ['../styles/login.style.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ForgotPasswordService]
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {
    public forgotPasswordForm: FormGroup;
    public submitted: boolean = false;
    public errorMessage: string = '';

    constructor(private formBuilder: FormBuilder,
        private elementRef: ElementRef,
        private router: Router,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private forgotPasswordService: ForgotPasswordService) { }

    public ngOnInit(): void {
        this.forgotPasswordForm = this.setForgotPasswordForm();
    }

    public ngAfterViewInit(): void {
        const $self: JQuery = jQuery(this.elementRef.nativeElement);
        $self.find('.input-group-addon').on('click', (event) => {
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
        this.forgotPasswordForm.reset();
        this.router.navigate(['login']);
    }

    public onSubmit(forgotPasswordModel: ForgotPasswordModel): void {
        this.submitted = true;
        this.errorMessage = '';

        if (this.forgotPasswordForm.valid) {
            console.log(forgotPasswordModel);
            this.forgotPasswordService.ResetPassword(forgotPasswordModel)
                .subscribe((response: AccountResponse) => {
                    if (response) {
                        if (response.Code === 4001) {
                            this.forgotPasswordForm.reset();
                            this.toastrService.success('Psaaword has been reset successfully. Redirecting to login for sign in again.', 'Reset Password', this.toastrConfig);
                            this.router.navigate(['login']);
                        } else if (response.Code === 0) {
                            this.errorMessage = 'User does not exists or invalid user';
                        }
                        else {
                            this.errorMessage = response.Message;
                        }
                    }
                });
        }
    }

    compareValidator(control: FormControl): any {
        if (this.forgotPasswordForm) {
            return control.value === this.forgotPasswordForm.get('NewPassword').value ? null : { notSame: true };
        }
    }

    private setForgotPasswordForm(forgotPasswordModel?: ForgotPasswordModel): FormGroup {
        this.compareValidator = this.compareValidator.bind(this);
        const formGroup: FormGroup = new FormGroup({
            EmailOrUserName: new FormControl(forgotPasswordModel ? forgotPasswordModel.EmailOrUserName : '', [Validators.required]),
            NewPassword: new FormControl(forgotPasswordModel ? forgotPasswordModel.NewPassword : '',
                [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(GlobalConstants.PASSWORD_PATTERN)]),
            ConfirmPassword: new FormControl(forgotPasswordModel ? forgotPasswordModel.ConfirmPassword : '', [Validators.required, this.compareValidator]),
        });
        return formGroup;
    }
}