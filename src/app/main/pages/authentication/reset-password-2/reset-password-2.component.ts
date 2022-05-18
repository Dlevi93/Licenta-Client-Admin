import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { locale as navigationEnglish } from './i18n/en';
import { locale as navigationHungarian } from './i18n/hu';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AuthService } from 'app/shared/services/auth.service';

@Component({
    selector: 'reset-password-2',
    templateUrl: './reset-password-2.component.html',
    styleUrls: ['./reset-password-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ResetPassword2Component implements OnInit, OnDestroy {
    resetPasswordForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _router: ActivatedRoute,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _authService: AuthService,
        private _routerNav: Router
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        if (this._authService.isLoggedIn) { this._routerNav.navigate(['/']); }

        this._fuseTranslationLoaderService.loadTranslations(navigationHungarian, navigationEnglish);

        this.resetPasswordForm = this._formBuilder.group({
            email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
            password: ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
            token: ['']
        });

        this._router.queryParams.pipe(takeUntil(this._unsubscribeAll))
            .subscribe(val => {
                var token = val.token.split(' ').join('+');
                this.resetPasswordForm.controls.token.setValue(token);
                this.resetPasswordForm.controls.email.setValue(val.email);
            });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.resetPasswordForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    resetPassword() {
        // this._userService.resetPassword(this.resetPasswordForm.getRawValue()).then(val => {
        //     this._routerNav.navigate(['/pages/auth/login-2'])
        // })
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!password || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    return { passwordsNotMatching: true };
};