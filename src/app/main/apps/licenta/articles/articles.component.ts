import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { takeUntil } from 'rxjs/internal/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as navigationEnglish } from '../i18n/en';
import { locale as naviRo } from '../i18n/ro';
import { ArticlesService } from './articles.service';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { environment } from 'environments/environment';
import { ArticleNaviService } from './articlesNavi.service';
import { Article } from 'app/shared/models/licenta/article.model';
import { Category } from 'app/shared/models/licenta/category.model';

@Component({
    selector: 'articles',
    templateUrl: './articles.component.html',
    styleUrls: ['./articles.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class ArticlesComponent implements OnInit, OnDestroy, AfterViewInit {
    baseUrl = `${environment.apiUrl}/`;
    selectedCategory: number;

    dataSource: FilesDataSource | null;
    displayedColumns = ['title', 'dateCreated', 'leading', 'active', 'category', 'views', 'articleLink'];

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    justActives: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ArticlesService} _articlesService
     */
    constructor(
        private _articlesService: ArticlesService,
        private _articlesNaviService: ArticleNaviService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _fuseProgressBarService: FuseProgressBarService
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
        this.setNavigationValues();
        this.dataSource = new FilesDataSource(this._articlesService, this.paginator, this.sort, this._fuseProgressBarService, this._articlesNaviService);

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(250),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if (!this.dataSource) {
                    return;
                }
                this.paginator.firstPage();
                this._articlesNaviService.searchText = this.filter.nativeElement.value;
                this.dataSource.filter = this._articlesNaviService;
            });

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(naviRo, navigationEnglish);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngAfterViewInit(): void {
    }

    setNavigationValues() {
        this.selectedCategory = 0;

        const isActive = this._articlesNaviService.isActive;
        const categoryId = this._articlesNaviService.categoryId;
        const searchText = this._articlesNaviService.searchText;

        if (categoryId !== undefined) {
            this.selectedCategory = categoryId;
        }
        if (isActive !== undefined && isActive) {
            this.justActives = isActive;
        }
        if (searchText !== undefined) {
            this.filter.nativeElement.value = searchText;
        }
        if (this._articlesNaviService.pagination !== undefined) {
            this.paginator.pageSize = this._articlesNaviService.pagination.pageSize;
            this.paginator.pageIndex = this._articlesNaviService.pagination.pageIndex;
        } else {
            this.paginator.pageSize = 10;
            this.paginator.pageIndex = 0;
        }
    }

    checkActives(checkbox: any) {
        this._articlesNaviService.isActive = checkbox;

        this.paginator.firstPage();
        this.dataSource.filter = this._articlesNaviService;
    }

    changeCategory(event: any) {
        this._articlesNaviService.categoryId = event;

        this.paginator.firstPage();
        this.dataSource.filter = this._articlesNaviService;
    }

    removeArticle(id) {
        this._articlesService.removeArticle(id).then(() => {
            this.paginator.firstPage();
            this._articlesNaviService.searchText = this.filter.nativeElement.value;
            this.dataSource.filter = this._articlesNaviService;
        });
    }
}

export class FilesDataSource extends DataSource<any>
{
    disconnect() {
    }

    public categories = new Array<Category>();
    public filteredData = new Array<Article>();
    public totalCount = 0;

    // Private
    private _filterChange: BehaviorSubject<ArticleNaviService>;

    /**
     * Constructor
     *
     * @param {ArticlesService} _articlesService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _articlesService: ArticlesService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort,
        private _fuseProgressBarService: FuseProgressBarService,
        private _membersNaviService: ArticleNaviService
    ) {
        super();
        this._filterChange = new BehaviorSubject<ArticleNaviService>(_membersNaviService);
        this.filteredData = this._articlesService.articles;
        this.totalCount = this._articlesService.totalCount;
        this.categories = this._articlesService.categories;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filter
    get filter(): ArticleNaviService {
        return this._filterChange.value;
    }

    set filter(filter: ArticleNaviService) {
        this._filterChange.next(filter);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        const displayDataChanges = [
            this._matPaginator.page,
            this._matSort.sortChange,
            this._filterChange
        ];

        // If the user changes the sort order, reset back to the first page.
        this._matSort.sortChange.subscribe(() => this._matPaginator.pageIndex = 0);

        return merge(...displayDataChanges)
            .pipe(
                startWith(() => {
                }),
                switchMap(() => {
                    this._fuseProgressBarService.show();

                    // save pagination if BACK is used
                    this._membersNaviService.pagination = this._matPaginator;
                    // get the data from the filters for BACK
                    let filteredData = this._filterChange.getValue();

                    return this._articlesService.getArticlesPaginated(
                        this._matSort.active, this._matSort.direction, this._matPaginator.pageIndex, this._matPaginator.pageSize, filteredData.categoryId, filteredData.searchText, filteredData.isActive);
                }),
                map(data => {
                    this._fuseProgressBarService.hide();
                    this.totalCount = data.rowCount;
                    return data.results;
                })
            );
    }
}