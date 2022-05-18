import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from 'app/shared/auth.guard';

const routes = [
    {
        path: 'licenta',
        loadChildren: () => import('./licenta/licenta.module').then(m => m.LicentaModule),
        canActivate: [AuthGuard],
        data: { roles: ['Admin'] }
    },
    {
        path: 'home',
        loadChildren: () => import('./licenta/home/home.module').then(m => m.HomeModule),
        canActivate: [AuthGuard],
        data: { roles: ['Admin'] }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule
    ]
})
export class AppsModule {
}
