import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as navigationEnglish } from './i18n/en';
import { locale as navigationRomanian } from './i18n/ro';

@Component({
    selector: 'quick-panel',
    templateUrl: './quick-panel.component.html',
    styleUrls: ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent implements OnInit, OnDestroy {
    date: Date;
    events: any[];
    notes: any[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        // Set the defaults
        this.date = new Date();

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
        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationRomanian, navigationEnglish);

        // Subscribe to the events
        // this._httpClient.get(`${environment.apiUrl}/api/calendar/calendarMonth`)
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((response: any) => {
        //         this.events = response;
        //     });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
