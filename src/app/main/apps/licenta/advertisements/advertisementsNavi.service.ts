import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Injectable()
export class AdvertisementsNaviService {
    searchText: string = '';

    pagination: MatPaginator;
}