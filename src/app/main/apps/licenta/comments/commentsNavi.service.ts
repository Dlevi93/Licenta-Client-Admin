import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Injectable()
export class CommentsNaviService {
    searchText: string = '';

    pagination: MatPaginator;
}