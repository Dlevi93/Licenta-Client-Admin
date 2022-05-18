import { Injectable } from '@angular/core';
import { adminNavigation } from 'app/navigation/navigation.admin';
import { mainNavigation } from 'app/navigation/navigation.main';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor(private _fuseNavigationService: FuseNavigationService) { }

    navigation = mainNavigation;

    // tslint:disable-next-line:typedef
    registerNavigations() {
        // register here all the navigation menus
        this._fuseNavigationService.register('admin', adminNavigation);

        // main is the empty, default nav
        this._fuseNavigationService.register('main', mainNavigation);
        this._fuseNavigationService.setCurrentNavigation('main');
    }

    // tslint:disable-next-line:typedef
    checkNavigation(currentUser: User) {
        this.setNavigationType(currentUser.roles[0]);
    }

    // tslint:disable-next-line:typedef
    setNavigationType(role: string) {
        switch (role) {
            case 'Admin':
                this._fuseNavigationService.setCurrentNavigation('admin');
                this.navigation = adminNavigation;
                break;
            default:
                this._fuseNavigationService.setCurrentNavigation('main');
                this.navigation = mainNavigation;
                break;
        }
    }
}
