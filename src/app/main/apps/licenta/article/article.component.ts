import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';

import { fuseAnimations } from '@fuse/animations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as navigationEnglish } from '../i18n/en';
import { locale as naviRo } from '../i18n/ro';

import { environment } from 'environments/environment';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ArticleService } from './article.service';
import { QuillEditorComponent } from 'ngx-quill';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Article, ArticleStyle } from 'app/shared/models/licenta/article.model';
import { Category } from 'app/shared/models/licenta/category.model';
import { ArticleFile } from 'app/shared/models/licenta/file.model';

@Component({
    selector: 'article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ArticleComponent implements OnInit, OnDestroy {
    baseUrl = `${environment.apiUrl}/`;
    articleForm: FormGroup;
    article: Article;

    pageType: string;

    files: NgxFileDropEntry[] = [];

    categories: Category[];
    articleStyles = ArticleStyle;
    articleStyleKeys = Object.keys(this.articleStyles).filter(k => isNaN(Number(k)));

    @ViewChild('editor', { static: true }) editor: QuillEditorComponent;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ClassService} _articleService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     */
    constructor(
        private _articleService: ArticleService,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        public _matDialog: MatDialog,
        private _location: Location,
    ) {
        // Set the defaults
        this.article = new Article();
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
        this._fuseTranslationLoaderService.loadTranslations(naviRo, navigationEnglish);

        // Subscribe to update order on changes
        this._articleService.onArticleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(article => {
                if (article) {
                    this.article = article;
                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.article = new Article();
                    this.article.id = 0;
                    this.article.active = true;
                    this.article.leading = false;
                    this.article.category = new Category();
                    this.article.dateCreated = new Date();
                }

                this.articleForm = this.createArticleForm();
                this.setImageAuthor();
            });

        // Subscribe to update order on changes
        this._articleService.onCategoryChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(categories => {
                this.categories = categories;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    createArticleForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.article.id],
            author: [this.article.author],
            dateCreated: [this.article.dateCreated],
            dateUpdated: [this.article.dateUpdated],
            title: [this.article.title, Validators.required],
            slug: [{ value: this.article.slug, disabled: true }, Validators.required],
            text: [this.article.text],
            leading: [this.article.leading],
            active: [this.article.active],
            views: [{ value: this.article.views, disabled: true }],
            categoryId: [this.article.category.id],
            style: [this.article.style],
            imgAuthor: ['']
        });
    }

    changeCategory(category) {
        console.log(category);
    }

    saveMember(): void {
        let imgAuthor = this.articleForm.controls.imgAuthor.value;

        let data = this.articleForm.getRawValue();
        let uploadImages = this.files.length > 0;
        this._articleService.saveArticle(data, uploadImages).then(() => { this.uploadFiles(this.article.slug, imgAuthor) });
    }

    addArticle(): void {
        let imgAuthor = this.articleForm.controls.imgAuthor.value;

        let data = this.articleForm.getRawValue();
        let uploadImages = this.files.length > 0;
        this._articleService.addArticle(data, uploadImages)
            .then(entity => {
                // Change the location with new one
                this._location.go('apps/eke/articles/' + entity.slug);
                this.uploadFiles(entity.slug, imgAuthor);
            });
    }

    setArticleType(event: any) {
        this.article.style = event.value;
        this.articleForm.controls.style.setValue(event.value);
    }

    dropped(files: NgxFileDropEntry[]) {
        this.files = files;
        this.articleForm.markAsDirty();
    }

    uploadFiles(slug: string, imgAuthor: string) {
        for (const droppedFile of this.files) {

            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {

                    console.log(this.articleForm.controls);
                    const formData = new FormData();
                    formData.append('formData', file, droppedFile.relativePath);
                    formData.append('author', imgAuthor);

                    this._articleService.uploadPicture(slug, formData).then((val: ArticleFile) => {
                        this.article.files.push(val);
                    })

                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                console.log(droppedFile.relativePath, fileEntry);
            }
        }
        this.files = [];
        this.setImageAuthor();
    }

    removePic(id: number) {
        this._articleService.removePicture(id).then(() => {
            this.article.files = this.article.files.filter(x => x.id !== id);
        })
    }

    setImageAuthor() {
        if (this.article.files !== undefined && this.article.files.length > 0) {
            this.articleForm.controls.imgAuthor.setValue(this.article.files[0].author);
        }
    }
}
