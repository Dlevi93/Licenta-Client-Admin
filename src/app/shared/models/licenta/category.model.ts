import { BaseModel } from './base.model';
import { Article } from './article.model';
import { ArticleFile } from './file.model';

export class Category extends BaseModel {
    name: string;
    order: number;
    parent: number;
    articles: Article[];
    files: ArticleFile[];
}