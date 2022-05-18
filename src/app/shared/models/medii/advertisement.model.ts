import { BaseModel } from './base.model';

export class Advertisement extends BaseModel {
    name: string;
    link: string;
    clicks: number;
    position: AdPosition;
}

export enum AdPosition {
    Header = 0,
    TopRight = 1,
    Middle1Big = 2,
    Middle1Right = 3,
    Middle2Big = 4,
    Middle2Right = 5,
    Middle3Big = 6,
    Middle4Right = 7,
    BottomBig = 8,
    BottomRight = 9,
    Footer = 10,
    Over = 11
}