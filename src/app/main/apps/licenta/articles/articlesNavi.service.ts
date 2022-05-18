import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Injectable()
export class ArticleNaviService {
    categoryId: number = 0;
    isActive: boolean = false;
    searchText: string = '';

    pagination: MatPaginator;
}