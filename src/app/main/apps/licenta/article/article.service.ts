import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { NotificationService } from 'app/shared/services/notification.service';
import { Article } from 'app/shared/models/licenta/article.model';
import { Category } from 'app/shared/models/licenta/category.model';

@Injectable()
export class ArticleService implements Resolve<any>{
    selectedArticle: Article;
    categories: Category[];
    routeParams: any;

    onArticleChanged: BehaviorSubject<any>;
    onCategoryChanged: BehaviorSubject<any>;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _notificationService: NotificationService,
    ) {
        this.onArticleChanged = new BehaviorSubject({});
        this.onCategoryChanged = new BehaviorSubject({});
    }

    /**
 * Resolver
 *
 * @param {ActivatedRouteSnapshot} route
 * @param {RouterStateSnapshot} state
 * @returns {Observable<any> | Promise<any> | any}
 */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise<void>((resolve, reject) => {

            Promise.all([
                this.getArticle(),
                this.getCategories()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getArticle(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.routeParams.id === 'new') {
                this.selectedArticle = new Article();
                this.onArticleChanged.next(false);
                resolve(false);
            }
            else {
                this._httpClient.get(`${environment.apiUrl}/api/article/${this.routeParams.id}`)
                    .subscribe((response: any) => {
                        this.selectedArticle = response;
                        this.onArticleChanged.next(this.selectedArticle);
                        resolve(response);
                    }, reject);
            }
        });
    }

    getCategories(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiUrl}/api/category/getAll`)
                .subscribe((response: any) => {
                    this.categories = response;
                    this.onCategoryChanged.next(this.categories);
                    resolve(response);
                }, reject);
        });
    }

    addArticle(data, uploadImages: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiUrl}/api/article`, data)
                .subscribe((response: Article) => {
                    this._notificationService.showSuccess(`${response.title} salvat cu succes!`, 'Succes');
                    this.selectedArticle = response;
                    this.onArticleChanged.next(this.selectedArticle);

                    if (uploadImages) this._notificationService.showInfo(`Incarcare imagini...`, 'Atentie!');

                    resolve(response);
                }, err => {
                    this._notificationService.showError('', 'Eroare');
                    reject(err);
                });
        });
    }

    saveArticle(data, uploadImages: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(`${environment.apiUrl}/api/article/${this.routeParams.id}`, data)
                .subscribe((response: Article) => {
                    this._notificationService.showSuccess(`${response.title} s-a modificat cu succes!`, 'Succes');
                    this.selectedArticle = response;
                    this.onArticleChanged.next(this.selectedArticle);

                    if (uploadImages) this._notificationService.showWarning(`Incarcare imagini...`, 'Atentie!');

                    resolve(response);
                }, err => {
                    this._notificationService.showError('', 'Eroare');
                    reject(err);
                });
        });
    }

    uploadPicture(slug: string, formData: any) {
        return new Promise((resolve, reject) => {
            this._httpClient.patch(`${environment.apiUrl}/api/article/uploadFile/${slug}`, formData)
                .subscribe((response: any) => {
                    this._notificationService.showSuccess('', 'Imagine incarcata cu succes');
                    resolve(response);
                }, err => {
                    this._notificationService.showError('', 'Eroare');
                    reject(err);
                });
        });
    }

    removePicture(id: number) {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(`${environment.apiUrl}/api/article/removePic/${id}`)
                .subscribe((response: any) => {
                    this._notificationService.showSuccess('', 'Succes');
                    resolve(response);
                }, err => {
                    this._notificationService.showError('', 'Eroare');
                    reject(err);
                });
        });
    }
}