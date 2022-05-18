import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Article } from 'app/shared/models/licenta/article.model';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from 'app/shared/models/licenta/category.model';

@Injectable()
export class ArticlesService implements Resolve<any>{
    articles: Article[];
    categories: Category[];
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
                this.getCategories()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getArticlesPaginated(sort: string, order: string, page: number, pageSize: number, categoryId: number, filter: string, justActives: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiUrl}/api/article?sort=${sort}&order=${order}&page=${page + 1}&pageSize=${pageSize}&justActives=${justActives}&categoryId=${categoryId}&filter=${filter}`)
                .subscribe((response: PaginatedArticles) => {
                    this.articles = response.results;
                    this.totalCount = response.rowCount;
                    resolve(response);
                }, reject);
        });
    }

    getCategories(): Promise<any> {
        if (this.categories !== undefined) return;

        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiUrl}/api/category/getAll`)
                .subscribe((response: Category[]) => {
                    this.categories = response;
                    resolve(response);
                }, reject);
        });
    }

    removeArticle(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(`${environment.apiUrl}/api/article/${id}`)
                .subscribe(data => {
                    resolve(data);
                }, reject);
        });
    }
}

export interface PaginatedArticles {
    results: Article[];
    rowCount: number;
}