import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

import { InvoiceService } from 'app/main/pages/invoices/invoice.service';
import { InvoiceModernComponent } from 'app/main/pages/invoices/modern/modern.component';
import {NgxPrintModule} from 'ngx-print';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

const routes = [
    {
        path     : 'invoices/modern',
        component: InvoiceModernComponent,
        resolve  : {
            search: InvoiceService
        }
    }
];

@NgModule({
    declarations: [
        InvoiceModernComponent
    ],
    imports     : [
        CommonModule,
        RouterModule.forChild(routes),

        FuseSharedModule,
        MatButtonModule,
        MatIconModule,
        NgxPrintModule
    ],
    providers   : [
        InvoiceService
    ]
})
export class InvoiceModernModule
{
}
