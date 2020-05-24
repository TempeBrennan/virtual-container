declare namespace Cyz {

    type event = 'change';

    export class VirtualContainer {
        constructor(container: HTMLDivElement, containerInfo: VirtualContainerInfo);
        public init(): void;
        public scroll(direction: Direction, offset: number): void;
        public resizeRow(rowIndex: number, rowHeight: number): void;
        public resizeColumn(columnIndex: number, columnWidth: number): void;
        public addEventListener(name: event, fn: Function): void;
        public removeEventListener(name: event, fn: Function): void;
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
}

export = Cyz;