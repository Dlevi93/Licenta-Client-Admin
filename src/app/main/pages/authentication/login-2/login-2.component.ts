import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/shared/services/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';

import { locale as navigationEnglish } from './i18n/en';
import { locale as naviRo } from './i18n/ro';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
    selector: 'login-2',
    templateUrl: './login-2.component.html',
    styleUrls: ['./login-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class Login2Component implements OnInit, OnDestroy {
    loginForm: FormGroup;
    loginSubscription: Subscription;
    invalidUser: false;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param {AuthService} _authService
     * 
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
        this._fuseTranslationLoaderService.loadTranslations(naviRo, navigationEnglish);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        if (this._authService.isLoggedIn) { this.router.navigate(['/']); }

        this.loginForm = this._formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', Validators.required],
            rememberMe: [false]
        });
    }

    ngOnDestroy(): void {
        this._fuseSplashScreenService.hide();
    }

    // tslint:disable-next-line:typedef
    loginUser() {
        this._fuseProgressBarService.show();
        this._authService.signIn(this.loginForm.value).then(data => {
            if (data.error !== undefined) {
                this._notificationService.showError(data.error, 'Eroare!');
                this._fuseProgressBarService.hide();
            }
        });
    }
}
