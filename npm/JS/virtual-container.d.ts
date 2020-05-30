declare namespace Cyz {

    type event = 'update';
    type direction = 'horizontal' | 'vertical';

    export class VirtualContainer {
        constructor(container: HTMLDivElement, containerInfo: Config);
        public init(): void;
        public scroll(direction: direction, offset: number): void;
        public resizeRow(rowIndex: number, rowHeight: number): void;
        public resizeColumn(columnIndex: number, columnWidth: number): void;
        public addEventListener(name: event, fn: Function): void;
        public removeEventListener(name: event, fn: Function): void;
    }

    export interface Config {
        rowCount: number;
        colCount: number;
        rowHeight: number;
        colWidth: number;
    }
}

export = Cyz;