import { BaseModel } from './base.model';
import { ArticleFile } from './file.model';
import { Category } from './category.model';

export class Article extends BaseModel {
    id: number;
    title: string;
    slug: string;
    text: string;
    leading: boolean;
    active: boolean;
    views: number;
    files: ArticleFile[];
    category: Category;
    style: number;
}

export enum ArticleStyle {
    Default = 0,
    TopFull = 1,
    TopLeft = 2,
    TopRight = 3,
    MiddleFull = 4,
    MiddleLeft = 5,
    MiddleRight = 6,
}