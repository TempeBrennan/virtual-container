export interface IDictionary<T> {
    [key: string]: T;
}

export interface EventArgs {
    name: string;
}

export interface VirtualContainerInfo {
    rowCount: number;
    colCount: number;
    rowHeight: number;
    colWidth: number;
    width: number;
    height: number;
}

export enum Direction {
    horizontal = 'horizontal',
    vertical = 'vertical',
}