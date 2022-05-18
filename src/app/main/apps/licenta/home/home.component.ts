import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { User } from 'app/shared/models/user.model';
import { AuthService } from 'app/shared/services/auth.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as navigationEnglish } from '../i18n/en';
import { locale as naviRo } from '../i18n/ro';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class HomeComponent implements OnInit {
    // ekeStats: EkeStatistics;
    user = new User();

    widgets: any;
    widget11: any = {};

    dateNow = Date.now();

    /**
     * Constructor
     *
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {ProjectDashboardService} _homeService
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _authService: AuthService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(naviRo, navigationEnglish);

        // this.ekeStats = this._homeService.ekeStats;

        this.initUser();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    initUser() {
        if (this._authService.currentUser !== undefined) this.user = this._authService.currentUser;
        else {
            this._authService.getUserProfile().subscribe(() => {
                this.user = this._authService.currentUser;
            });
        }
    }
}