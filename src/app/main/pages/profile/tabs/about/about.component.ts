import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { User } from 'app/shared/models/user.model';
import { environment } from 'environments/environment';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as navigationEnglish } from '../.././i18n/en';
import { locale as navigationHungarian } from '../.././i18n/hu';

@Component({
    selector: 'profile-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProfileAboutComponent implements OnInit, OnDestroy {
    baseUrl = `${environment.apiUrl}/`;
    @Input() user = new User();

    about: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
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
        this._fuseTranslationLoaderService.loadTranslations(navigationHungarian, navigationEnglish);
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
