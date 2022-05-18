import { LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';

import { TranslateModule } from '@ngx-translate/core';

import { ArticlesComponent } from './articles/articles.component';
import { ArticlesService } from './articles/articles.service';
import { ArticleComponent } from './article/article.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePipe } from '@angular/common';
import { ArticleNaviService } from './articles/articlesNavi.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ArticleService } from './article/article.service';

import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';

import Quill from 'quill';
import { QuillModule } from 'ngx-quill'
import 'quill-emoji/dist/quill-emoji.js'
import ImageResize from 'quill-image-resize';
import { CommentsComponent } from './comments/comments.component';
import { CommentsService } from './comments/comments.service';
import { CommentsNaviService } from './comments/commentsNavi.service';
import { AdvertisementsComponent } from './advertisements/advertisements.component';
import { AdvertisementsService } from './advertisements/advertisements.service';
import { AdvertisementsNaviService } from './advertisements/advertisementsNavi.service';
Quill.register('modules/imageResize', ImageResize);

import { registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';
registerLocaleData(localeRo);

const routes: Routes = [
    {
        path: 'articles',
        component: ArticlesComponent,
        resolve: {
            data: ArticlesService
        }
    },
    {
        path: 'articles/:id',
        component: ArticleComponent,
        resolve: {
            data: ArticleService
        }
    },
    {
        path: 'comments',
        component: CommentsComponent,
        resolve: {
            data: CommentsService
        }
    },
    {
        path: 'advertisements',
        component: AdvertisementsComponent,
        resolve: {
            data: AdvertisementsService
        }
    }
];

@NgModule({
    declarations: [
        ArticleComponent,
        ArticlesComponent,
        CommentsComponent,
        AdvertisementsComponent,
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatDatepickerModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatRadioModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatTooltipModule,
        MatAutocompleteModule,

        TranslateModule,
        NgxFileDropModule,

        NgxMatMomentModule,
        NgxMatTimepickerModule,
        NgxMatDatetimePickerModule,

        QuillModule.forRoot({
            modules: {
                'emoji-shortname': true,
                'emoji-textarea': true,
                'emoji-toolbar': true,
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                    [{ 'direction': 'rtl' }],                         // text direction

                    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                    [{ 'font': [] }],
                    [{ 'align': [] }],

                    ['clean'],                                         // remove formatting button

                    ['link', 'image', 'video'],                        // link and image, video
                    ['emoji']
                ],
                imageResize: true
            }
        }),

        FuseSharedModule,
        FuseWidgetModule
    ],
    providers: [
        ArticleService,
        ArticlesService,
        ArticleNaviService,
        CommentsService,
        CommentsNaviService,
        AdvertisementsService,
        AdvertisementsNaviService,
        DatePipe,
        { provide: LOCALE_ID, useValue: 'ro-RO' },
    ]
})
export class LicentaModule {
}
