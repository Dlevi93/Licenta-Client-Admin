import { BaseModel } from './base.model';
import { Article } from './article.model';

export class ArticleComment extends BaseModel {
    fullName: string;
    email: string;
    text: string;
    imagePath: string;
    article: Article;
}