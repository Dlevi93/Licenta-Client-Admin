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
import { AdvertisementsService } from './advertisements.service';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { environment } from 'environments/environment';
import { AdvertisementsNaviService } from './advertisementsNavi.service';
import { Advertisement, AdPosition } from 'app/shared/models/licenta/advertisement.model';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ArticleFile } from 'app/shared/models/licenta/file.model';

@Component({
    selector: 'advertisements',
    templateUrl: './advertisements.component.html',
    styleUrls: ['./advertisements.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class AdvertisementsComponent implements OnInit, OnDestroy, AfterViewInit {
    baseUrl = `${environment.apiUrl}/`;
    adForm: FormGroup;

    files: NgxFileDropEntry[] = [];

    dataSource: FilesDataSource | null;
    displayedColumns = ['name', 'dateCreated', 'position', 'clicks', 'adsLink'];

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    adPositions = AdPosition;
    adPositionKeys = Object.keys(this.adPositions).filter(k => isNaN(Number(k)));

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {AdvertisementsService} _advertisementsService
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _advertisementsService: AdvertisementsService,
        private _adsNaviService: AdvertisementsNaviService,
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
        this.dataSource = new FilesDataSource(this._advertisementsService, this.paginator, this.sort, this._fuseProgressBarService, this._adsNaviService);

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
                this._adsNaviService.searchText = this.filter.nativeElement.value;
                this.dataSource.filter = this._adsNaviService;
            });

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(naviRo, navigationEnglish);

        this.adForm = this.createAdForm();
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
        const searchText = this._adsNaviService.searchText;

        if (searchText !== undefined) {
            this.filter.nativeElement.value = searchText;
        }
        if (this._adsNaviService.pagination !== undefined) {
            this.paginator.pageSize = this._adsNaviService.pagination.pageSize;
            this.paginator.pageIndex = this._adsNaviService.pagination.pageIndex;
        } else {
            this.paginator.pageSize = 10;
            this.paginator.pageIndex = 0;
        }
    }

    createAdForm(): FormGroup {
        return this._formBuilder.group({
            name: ['', Validators.required],
            link: ['', Validators.required],
            position: [0, Validators.required]
        });
    }

    checkActives(checkbox: any) {
        this.paginator.firstPage();
        this.dataSource.filter = this._adsNaviService;
    }

    changeCategory(event: any) {
        this.paginator.firstPage();
        this.dataSource.filter = this._adsNaviService;
    }

    dropped(files: NgxFileDropEntry[]) {
        this.files = files;
        this.adForm.markAsDirty();
    }

    saveAd(): void {
        let data = this.adForm.getRawValue();
        let uploadImages = this.files.length > 0;
        this._advertisementsService.addAd(data, uploadImages)
            .then(entity => {
                this.paginator.firstPage();
                // Change the location with new one
                this.uploadFiles(entity.id);
            });
    }

    uploadFiles(id: number) {
        for (const droppedFile of this.files) {

            // Is it a file?
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {

                    const formData = new FormData()
                    formData.append('formData', file, droppedFile.relativePath)

                    this._advertisementsService.uploadPicture(id, formData).then((val: ArticleFile) => {
                    })

                });
            } else {
                // It was a directory (empty directories are added, otherwise only files)
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                console.log(droppedFile.relativePath, fileEntry);
            }
        }
        this.files = [];
    }

    removeAd(id) {
        this._advertisementsService.removeAd(id).then(() => {
            this.paginator.firstPage();
        });
    }
}

export class FilesDataSource extends DataSource<any>
{
    disconnect() {
    }

    public filteredData = new Array<Advertisement>();
    public totalCount = 0;

    // Private
    private _filterChange: BehaviorSubject<AdvertisementsNaviService>;

    /**
     * Constructor
     *
     * @param {ArticlesService} _adsService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _adsService: AdvertisementsService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort,
        private _fuseProgressBarService: FuseProgressBarService,
        private _adsNaviService: AdvertisementsNaviService
    ) {
        super();
        this._filterChange = new BehaviorSubject<AdvertisementsNaviService>(_adsNaviService);
        this.filteredData = this._adsService.ads;
        this.totalCount = this._adsService.totalCount;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filter
    get filter(): AdvertisementsNaviService {
        return this._filterChange.value;
    }

    set filter(filter: AdvertisementsNaviService) {
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
                    this._adsNaviService.pagination = this._matPaginator;
                    // get the data from the filters for BACK
                    let filteredData = this._filterChange.getValue();

                    return this._adsService.getAdsPaginated(
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