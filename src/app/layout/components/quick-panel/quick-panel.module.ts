import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FuseSharedModule } from '@fuse/shared.module';

import { QuickPanelComponent } from 'app/layout/components/quick-panel/quick-panel.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        QuickPanelComponent
    ],
    imports     : [
        MatDividerModule,
        MatListModule,
        MatSlideToggleModule,

        TranslateModule,

        FuseSharedModule,
    ],
    exports: [
        QuickPanelComponent
    ]
})
export class QuickPanelModule
{
}
