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
import { CommentsService } from './comments.service';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { environment } from 'environments/environment';
import { CommentsNaviService } from './commentsNavi.service';
import { ArticleComment } from 'app/shared/models/licenta/comment.model';

@Component({
    selector: 'comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class CommentsComponent implements OnInit, OnDestroy, AfterViewInit {
    baseUrl = `${environment.apiUrl}/`;

    dataSource: FilesDataSource | null;
    displayedColumns = ['logo', 'fullName', 'email', 'articleTitle', 'text', 'dateCreated', 'articleLink'];

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ArticlesService} _commentsService
     */
    constructor(
        private _commentsService: CommentsService,
        private _commentsNaviService: CommentsNaviService,
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
        this.dataSource = new FilesDataSource(this._commentsService, this.paginator, this.sort, this._fuseProgressBarService, this._commentsNaviService);

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
                this._commentsNaviService.searchText = this.filter.nativeElement.value;
                this.dataSource.filter = this._commentsNaviService;
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
        const searchText = this._commentsNaviService.searchText;

        if (searchText !== undefined) {
            this.filter.nativeElement.value = searchText;
        }
        if (this._commentsNaviService.pagination !== undefined) {
            this.paginator.pageSize = this._commentsNaviService.pagination.pageSize;
            this.paginator.pageIndex = this._commentsNaviService.pagination.pageIndex;
        } else {
            this.paginator.pageSize = 10;
            this.paginator.pageIndex = 0;
        }
    }

    removeComment(id) {
        this._commentsService.removeComment(id).then(() => {
            this.paginator.firstPage();
            this._commentsNaviService.searchText = this.filter.nativeElement.value;
            this.dataSource.filter = this._commentsNaviService;
        });
    }
}

export class FilesDataSource extends DataSource<any>
{
    disconnect() {
    }

    public filteredData = new Array<ArticleComment>();
    public totalCount = 0;

    // Private
    private _filterChange: BehaviorSubject<CommentsNaviService>;

    /**
     * Constructor
     *
     * @param {ArticlesService} _commentsService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _commentsService: CommentsService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort,
        private _fuseProgressBarService: FuseProgressBarService,
        private _membersNaviService: CommentsNaviService
    ) {
        super();
        this._filterChange = new BehaviorSubject<CommentsNaviService>(_membersNaviService);
        this.filteredData = this._commentsService.comments;
        this.totalCount = this._commentsService.totalCount;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filter
    get filter(): CommentsNaviService {
        return this._filterChange.value;
    }

    set filter(filter: CommentsNaviService) {
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

                    return this._commentsService.getCommentsPaginated(
                        this._matSort.active, this._matSort.direction, this._matPaginator.pageIndex, this._matPaginator.pageSize, filteredData.searchText);
                }),
                map(data => {
                    this._fuseProgressBarService.hide();
                    this.totalCount = data.rowCount;
                    return data.results;
                })
            );
    }
}