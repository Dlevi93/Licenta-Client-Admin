import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { AuthService } from 'app/shared/services/auth.service';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { locale as navigationEnglish } from './i18n/en';
import { locale as navigationHungarian } from './i18n/hu';
import { Router } from '@angular/router';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
    selector: 'forgot-password-2',
    templateUrl: './forgot-password-2.component.html',
    styleUrls: ['./forgot-password-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ForgotPassword2Component implements OnInit, OnDestroy {
    forgotPasswordForm: FormGroup;
    routeParams: any;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public router: Router,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        public _authService: AuthService,
        public _fuseProgressBarService: FuseProgressBarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _notificationService: NotificationService
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

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationHungarian, navigationEnglish);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        if (this._authService.isLoggedIn) { this.router.navigate(['/']); }

        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    ngOnDestroy(): void {
        this._fuseSplashScreenService.hide();
    }

    // tslint:disable-next-line:typedef
    forgotPassword() {
        // this._notificationService.showInfo('A funkció jelenleg nem elérhetõ', 'Figyelem');
        // return;

        // this._fuseProgressBarService.show();
    }
}
