import {
    Component, OnInit, OnDestroy,
    ViewEncapsulation, ElementRef, AfterViewInit
} from '@angular/core';
import { ForgotPasswordService } from './forgot.password.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalConstants } from '../../../shared/constants/constants';
import { ForgotPasswordModel } from './auth.model';
import { AccountResponse } from '../../../shared/models';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';

@Component({
    selector: 'forgot-password',
    templateUrl: '../views/forgot.password.view.html',
    styleUrls: ['../styles/login.style.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ForgotPasswordService]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy, AfterViewInit {
    public forgotPasswordForm: FormGroup;
    public submitted: boolean = false;
    public errorMessage: string = '';
    public SecurityQuestion: string = '';
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of ForgotPasswordComponent.
     * @param {ElementRef} elementRef
     * @param {Router} router
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     * @param {ForgotPasswordService} forgotPasswordService
     * @memberof ForgotPasswordComponent
     */
    constructor(private elementRef: ElementRef,
        private router: Router,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private forgotPasswordService: ForgotPasswordService) { }

    public ngOnInit(): void {
        this.forgotPasswordForm = this.setForgotPasswordForm();
    }

    public onBlurMethod(value): void {
        this.forgotPasswordService.GetEecurityQuestion(value)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((x) => {
                this.SecurityQuestion = x;
                if (x == null || x === undefined) {
                    this.toastrService.error('The UserId or Email does not exist');
                }
                else if (x.trim().length <= 0) {
                    this.toastrService.error('The UserId or Email does not exist');
                }
                else {
                    this.forgotPasswordForm.controls['SecurityQuestion']
                        .setValue(this.SecurityQuestion);
                }
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
                this.toastrService.error('The UserId or Email does not exist');
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public ngAfterViewInit(): void {
        const $self: JQuery = jQuery(this.elementRef.nativeElement);

        $self.find('.input-group-addon')
            .on('mousedown', (event) => {
                const $btn: JQuery = $(event.currentTarget);
                const $input: JQuery = $btn.siblings('input');

                if ($input.text() !== 'empty') {
                    $btn.find('i').toggleClass('fa-eye fa-eye-slash');
                    if ($btn.find('i').hasClass('fa-eye')) {
                        $input.attr('type', 'text');
                    }
                }
            })
            .on('mouseup', (event) => {
                const $btn: JQuery = $(event.currentTarget);
                const $input: JQuery = $btn.siblings('input');

                if ($input.text() !== 'empty') {
                    $btn.find('i').toggleClass('fa-eye fa-eye-slash');
                    if ($btn.find('i').hasClass('fa-eye-slash')) {
                        $input.attr('type', 'password');
                    }
                }
            })
    }

    public onCancelClick($event): void {
        this.forgotPasswordForm.reset();
        this.router.navigate(['login']);
    }

    public onSubmit(forgotPasswordModel: ForgotPasswordModel): void {
        this.submitted = true;
        this.errorMessage = '';

        if (this.forgotPasswordForm.valid) {
            this.forgotPasswordService.ResetPassword(forgotPasswordModel)
                .subscribe((response: AccountResponse) => {
                    if (response) {
                        if (response.Code === 4001) {
                            this.forgotPasswordForm.reset();
                            this.toastrService.success('Password has been reset successfully. Redirecting to login for sign in again.', 'Reset Password', this.toastrConfig);
                            this.router.navigate(['login']);
                        } else if (response.Code === 0) {
                            this.errorMessage = 'User does not exists or invalid user';
                        }
                        else {
                            this.errorMessage = response.Message;
                        }
                    }
                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
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
            SecurityQuestion: new FormControl(forgotPasswordModel ? forgotPasswordModel.SecurityQuestion : '', [Validators.required]),
            SecurityAnswer: new FormControl(forgotPasswordModel ? forgotPasswordModel.SecurityAnswer : '', [Validators.required]),
            EmailOrUserName: new FormControl(forgotPasswordModel ? forgotPasswordModel.EmailOrUserName : '', [Validators.required]),
            NewPassword: new FormControl(forgotPasswordModel ? forgotPasswordModel.NewPassword : '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(20),
                    Validators.pattern(/^(?!.*[\s])(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)
                ]),
            ConfirmPassword: new FormControl(forgotPasswordModel ? forgotPasswordModel.ConfirmPassword : '',
                [Validators.required,
                this.compareValidator]),
        });
        return formGroup;
    }
}