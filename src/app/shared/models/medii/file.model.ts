import { BaseModel } from './base.model';
import { Article } from './article.model';
import { Category } from './category.model';
import { Advertisement } from './advertisement.model';

export class ArticleFile extends BaseModel {
    fileName: string;
    contentType: string;
    content: string;
    fileType: FileType;
    category: Category;
    article: Article;
    advertisment: Advertisement;
}

export enum FileType {
    Image = 1,
    Video = 2,
    Pdf = 3,
    Document = 4,
    Other = 5
}