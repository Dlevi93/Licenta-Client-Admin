import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleComment } from 'app/shared/models/licenta/comment.model';

@Injectable()
export class CommentsService implements Resolve<any>{
    comments: ArticleComment[];

    totalCount: number;
    routeParams: any;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
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

    getCommentsPaginated(sort: string, order: string, page: number, pageSize: number, filter: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiUrl}/api/comment?sort=${sort}&order=${order}&page=${page + 1}&pageSize=${pageSize}&filter=${filter}`)
                .subscribe((response: PaginatedComments) => {
                    this.comments = response.results;
                    this.totalCount = response.rowCount;
                    resolve(response);
                }, reject);
        });
    }

    removeComment(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(`${environment.apiUrl}/api/comment/${id}`)
                .subscribe(data => {
                    resolve(data);
                }, reject);
        });
    }
}

export interface PaginatedComments {
    results: ArticleComment[];
    rowCount: number;
}