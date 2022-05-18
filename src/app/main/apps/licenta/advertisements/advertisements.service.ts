import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Advertisement } from 'app/shared/models/licenta/advertisement.model';
import { NotificationService } from 'app/shared/services/notification.service';

@Injectable()
export class AdvertisementsService implements Resolve<any>{
    ads: Advertisement[];
    totalCount: number;
    routeParams: any;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _notificationService: NotificationService,
    ) {
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
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getAdsPaginated(sort: string, order: string, page: number, pageSize: number, filter: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiUrl}/api/advertisement?sort=${sort}&order=${order}&page=${page + 1}&pageSize=${pageSize}&filter=${filter}`)
                .subscribe((response: PaginatedAds) => {
                    this.ads = response.results;
                    this.totalCount = response.rowCount;
                    resolve(response);
                }, reject);
        });
    }

    addAd(data, uploadImages: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiUrl}/api/advertisement`, data)
                .subscribe((response: Advertisement) => {
                    this._notificationService.showSuccess(`${response.name} s-a salvat cu succes!`, 'Succes!');
                    if (uploadImages) this._notificationService.showInfo(`Incarcare imagine...!`, 'Atentie!');

                    resolve(response);
                }, err => {
                    this._notificationService.showError('', 'Eroare');
                    reject(err);
                });
        });
    }

    uploadPicture(id: number, formData: any) {
        return new Promise((resolve, reject) => {
            this._httpClient.patch(`${environment.apiUrl}/api/advertisement/uploadFile/${id}`, formData)
                .subscribe((response: any) => {
                    this._notificationService.showSuccess('', 'Imagine salvata cu succes');
                    resolve(response);
                }, err => {
                    this._notificationService.showError('', 'Eroare in timpul incarcarii');
                    reject(err);
                });
        });
    }

    removeAd(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(`${environment.apiUrl}/api/advertisement/${id}`)
                .subscribe(data => {
                    resolve(data);
                }, reject);
        });
    }
}

export interface PaginatedAds {
    results: Advertisement[];
    rowCount: number;
}