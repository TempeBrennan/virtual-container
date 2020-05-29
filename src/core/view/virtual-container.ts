import { VirtualContainerService, ServiceEvent, RowInitArgs, ColumnInitArgs, RowChangeArgs, ColumnInfo, ColumnState, ColumnChangeArgs, RowInfo, OffsetChangeArgs } from "../service/virtual-container.service";
import { VirtualContainerInfo, Direction, EventArgs } from "../../common/common-type";
import { EventBase } from "../../common/event-base";

export class VirtualContainer extends EventBase {
    private _container: HTMLDivElement;
    private _containerInfo: VirtualContainerInfo;
    private _service: VirtualContainerService;

    constructor(container: HTMLDivElement, containerInfo: VirtualContainerInfo) {
        super();
        this._container = container;
        this._containerInfo = containerInfo;
    }

    //#region Public
    public resizeRow(rowIndex: number, rowHeight: number): void {
        this._service.resizeRow(rowIndex, rowHeight);
    }

    public resizeColumn(columnIndex: number, columnWidth: number): void {
        this._service.resizeColumn(columnIndex, columnWidth);
    }

    public init(): void {
        this._service = new VirtualContainerService(this._containerInfo);
        this._container = this._container;
        this.bindElementEvent();
        this.bindServiceEvent();
        this._service.init();
    }

    public scroll(direction: Direction, offset: number): void {
        this._service.scroll(direction, offset);
    }
    //#endregion

    //#region Init

    private rowInit(s, e: RowInitArgs): void {
        this.initElement(e.totalHeight);
        this.initRowElement(e.rowPositions, e.rowHeight);
    }

    private columnInit(s, e: ColumnInitArgs): void {
        this.initColumnElement(e.totalWidth, e.colCount, e.colWidth, e.colPositions);
        this.raiseUpdateEvent(this._service.getRowState().rowInfos, this._service.getColumnState().columnInfos);
    }
    //#endregion

    //#region CSS
    private getContainerClassName(): string {
        return "virtual-container";
    }

    private getVirtualCanvasClassName(): string {
        return 'virtual-canvas';
    }

    private getRowClassName(): string {
        return `virtual-container-row`;
    }

    private getCellClassName(): string {
        return `virtual-container-cell`;
    }

    private getRowIndexClassName(rowIndex: number): string {
        return `virtual-container-r${rowIndex}`;
    }

    private getCellIndexClassName(rowIndex: number): string {
        return `virtual-container-c${rowIndex}`;
    }
    //#endregion

    //#region HTML

    //#region VirtualCanvas
    private initElement(height: number): void {
        this._container.classList.add(this.getContainerClassName());
        var virtualCanvas = this.createVirtualCanvas(height, Direction.vertical);
        this._container.appendChild(virtualCanvas);
    }

    private createVirtualCanvas(size: number, direction: Direction): HTMLDivElement {
        var div = document.createElement('div');
        div.classList.add(this.getVirtualCanvasClassName());
        div.style.position = 'relative';
        if (direction === Direction.vertical) {
            div.style.height = `${size}px`;
        } else {
            div.style.height = "100%";
            div.style.width = `${size}px`;
        }
        return div;
    }
    //#endregion

    //#region Row

    //#region Create
    private createRowElement(rowIndex: number, rowHeight: number, rowPosition: number): HTMLDivElement {
        var rowElement = document.createElement('div');
        rowElement.classList.add(this.getRowClassName());
        rowElement.classList.add(this.getRowIndexClassName(rowIndex));
        rowElement.style.position = 'absolute';
        rowElement.style.width = '100%';
        rowElement.style.height = `${rowHeight}px`;
        rowElement.style.top = `${rowPosition}px`;
        return rowElement;
    }
    //#endregion

    //#region Delete
    private removeRowElement(rowIndex: number): void {
        var virtualCanvas = this.getCanvas();
        virtualCanvas.removeChild(this.getRowElement(rowIndex));
    }
    //#endregion

    //#region Update
    private insertRowElement(rowIndex: number, rowHeight: number, rowPosition: number, totalWidth: number, cellInfos: Array<ColumnInfo>): void {
        var virtualCanvas = this.getCanvas();
        var rowElement = this.createRowElement(rowIndex, rowHeight, rowPosition);

        var rowVirtualCanvas = this.createVirtualCanvas(totalWidth, Direction.horizontal);
        rowVirtualCanvas.appendChild(this.createCellList(cellInfos));
        rowElement.appendChild(rowVirtualCanvas);

        virtualCanvas.appendChild(rowElement);
    }

    private updateRowIndex(oldRowIndex: number, newRowIndex: number): void {
        var rowElement = this.getRowElement(oldRowIndex);
        rowElement.classList.remove(this.getRowIndexClassName(oldRowIndex));
        rowElement.classList.add(this.getRowIndexClassName(newRowIndex));
    }

    private setRowHeight(rowIndex: number, rowHeight: number): void {
        var rowElement = this.getRowElement(rowIndex);
        rowElement.style.height = `${rowHeight}px`;
    }

    private setRowPosition(rowIndex: number, rowPosition: number): void {
        var rowElement = this.getRowElement(rowIndex);
        rowElement.style.top = `${rowPosition}px`;
    }
    //#endregion

    //#region Select
    private getRowElement(rowIndex: number): HTMLDivElement {
        return this._container.querySelector(`.${this.getRowIndexClassName(rowIndex)}`);
    }

    private getAllRowElements(): NodeListOf<HTMLDivElement> {
        return this._container.querySelectorAll(`.${this.getRowClassName()}`);
    }

    private getCanvas(): HTMLDivElement {
        return this._container.querySelector(`.${this.getVirtualCanvasClassName()}`);
    }
    //#endregion

    private initRowElement(rowPosition: Array<number>, rowHeight: number): void {
        var virtualCanvas = this.getCanvas();
        var fragement = document.createDocumentFragment();
        for (var i = 0; i < rowPosition.length; i++) {
            fragement.appendChild(this.createRowElement(i, rowHeight, rowPosition[i]));
        }
        virtualCanvas.appendChild(fragement);
    }
    //#endregion

    //#region Column

    //#region Create
    private createCellElement(columnIndex: number, columnWidth: number, columnPosition: number): HTMLDivElement {
        var cellElement = document.createElement('div');
        cellElement.classList.add(this.getCellClassName());
        cellElement.classList.add(this.getCellIndexClassName(columnIndex));
        cellElement.style.position = 'absolute';
        cellElement.style.width = `${columnWidth}px`;
        cellElement.style.height = `100%`;
        cellElement.style.left = `${columnPosition}px`;
        return cellElement;
    }

    private createCellList(cellInfos: Array<ColumnInfo>): DocumentFragment {
        var fragement = document.createDocumentFragment();
        for (var i = 0; i < cellInfos.length; i++) {
            fragement.appendChild(this.createCellElement(cellInfos[i].columnIndex, cellInfos[i].columnWidth, cellInfos[i].position));
        }
        return fragement;
    }

    private initColumnElement(totalWidth: number, columnCount: number, columnWidth: number, columnPositions: Array<number>): void {
        this.getAllRowElements().forEach(rowElement => {
            var virtualCanvas = this.createVirtualCanvas(totalWidth, Direction.horizontal);
            virtualCanvas.appendChild(this.createCellListFragement(columnCount, columnWidth, columnPositions));
            rowElement.appendChild(virtualCanvas);
        });
    }
    //#endregion

    //#region Delete
    private removeCellElement(rowIndex: number, columnIndex: number): void {
        var rowCanvas = this.getRowCanvas(rowIndex);
        var cellElement = this.getCellElement(rowCanvas, columnIndex);
        rowCanvas.removeChild(cellElement);
    }
    //#endregion

    //#region Update
    private insertCellElement(rowIndex: number, columnIndex: number, columnWidth: number, columnPosition: number): void {
        var rowCanvas = this.getRowCanvas(rowIndex);
        var cellElement = this.createCellElement(columnIndex, columnWidth, columnPosition);
        rowCanvas.appendChild(cellElement);
    }

    private updateColumnIndex(rowIndex: number, oldCellIndex: number, newCellIndex: number): void {
        var cellElement = this.getCellElement(this.getRowElement(rowIndex), oldCellIndex);
        cellElement.classList.remove(this.getCellIndexClassName(oldCellIndex));
        cellElement.classList.add(this.getCellIndexClassName(newCellIndex));
    }

    private setColumnWidth(rowIndex: number, columnIndex: number, columnWidth: number): void {
        var cellElement = this.getCellElement(this.getRowElement(rowIndex), columnIndex);
        cellElement.style.width = `${columnWidth}px`;
    }

    private setColumnPosition(rowIndex: number, colIndex: number, position: number): void {
        var ele = this.getCellElement(this.getRowElement(rowIndex), colIndex);
        ele.style.left = `${position}px`;
    }
    //#endregion

    //#region Select
    private getCellElement(rowElement: HTMLDivElement, columnIndex: number): HTMLDivElement {
        return rowElement.querySelector(`.${this.getCellIndexClassName(columnIndex)}`);
    }

    private getRowCanvas(rowIndex: number): HTMLDivElement {
        var rowElement = this.getRowElement(rowIndex);
        return rowElement.querySelector(`.${this.getVirtualCanvasClassName()}`);
    }
    //#endregion

    private createCellListFragement(columnCount: number, columnWidth: number, columnPositions: Array<number>): DocumentFragment {
        var fragement = document.createDocumentFragment();
        for (var i = 0; i < columnCount; i++) {
            fragement.appendChild(this.createCellElement(i, columnWidth, columnPositions[i]));
        }
        return fragement;
    }
    //#endregion

    //#endregion

    //#region Event
    private bindElementEvent(): void {
        this._container.addEventListener('scroll', () => {
            this._service.scroll(Direction.horizontal, this._container.scrollLeft);
            this._service.scroll(Direction.vertical, this._container.scrollTop);
        });
    }

    private bindServiceEvent(): void {
        this._service.addEventListener(ServiceEvent.RowInit, this.rowInit.bind(this));
        this._service.addEventListener(ServiceEvent.ColInit, this.columnInit.bind(this));
        this._service.addEventListener(ServiceEvent.RowChange, this.rowChange.bind(this));
        this._service.addEventListener(ServiceEvent.ColChange, this.columnChange.bind(this));
        this._service.addEventListener(ServiceEvent.OffsetChange, this.offsetChange.bind(this));
    }

    private rowChange(s, e: RowChangeArgs): void {
        var state = this._service.getColumnState();
        var columnInfos: Array<ColumnInfo> = state.columnInfos;
        var rowInfos: Array<RowInfo> = [];

        e.addRows.forEach((r) => {
            this.insertRowElement(r.rowIndex, r.rowHeight, r.position, state.totalWidth, columnInfos);
            rowInfos.push(r);
        });
        e.updateRows.forEach((r) => {
            /**Update row index */
            if (r.oldRowInfo.rowIndex !== r.newRowInfo.rowIndex) {
                this.updateRowIndex(r.oldRowInfo.rowIndex, r.newRowInfo.rowIndex);
            }

            if (r.oldRowInfo.rowHeight !== r.newRowInfo.rowHeight) {
                this.setRowHeight(r.newRowInfo.rowIndex, r.newRowInfo.rowHeight);
            } else if (r.oldRowInfo.position !== r.newRowInfo.position) {
                this.setRowPosition(r.newRowInfo.rowIndex, r.newRowInfo.position);
            }
            rowInfos.push(r.newRowInfo);

        });
        e.removeRows.forEach((r) => {
            this.removeRowElement(r.rowIndex);
        });

        this.raiseUpdateEvent(rowInfos, columnInfos);

    }

    private columnChange(s, e: ColumnChangeArgs): void {
        var rowState = this._service.getRowState();
        var rowInfos: Array<RowInfo> = rowState.rowInfos;
        var columnInfos: Array<ColumnInfo> = [];
        e.addColumns.forEach((c) => {
            rowInfos.forEach(r => {
                this.insertCellElement(r.rowIndex, c.columnIndex, c.columnWidth, c.position);
                columnInfos.push(c);
            });
        });
        e.updateColumns.forEach((c) => {
            rowInfos.forEach(r => {
                if (c.oldColumnInfo.columnIndex !== c.newColumnInfo.columnIndex) {
                    this.updateColumnIndex(r.rowIndex, c.oldColumnInfo.columnIndex, c.newColumnInfo.columnIndex);
                }

                if (c.oldColumnInfo.columnWidth !== c.newColumnInfo.columnWidth) {
                    this.setColumnWidth(r.rowIndex, c.newColumnInfo.columnIndex, c.newColumnInfo.columnWidth);
                } else if (c.oldColumnInfo.position !== c.newColumnInfo.position) {
                    this.setColumnPosition(r.rowIndex, c.newColumnInfo.columnIndex, c.newColumnInfo.position);
                }
                columnInfos.push(c.newColumnInfo);
            });
        });
        e.removeColumns.forEach((c) => {
            rowInfos.forEach(r => {
                this.removeCellElement(r.rowIndex, c.columnIndex);
            });
        });
        this.raiseUpdateEvent(rowInfos, columnInfos);
    }

    private createChangeArgs(rowInfos: Array<RowInfo>, columnInfos: Array<ColumnInfo>): ChangeArgs {
        var cellInfoList: Array<CellInfo> = [];
        columnInfos.sort((a, b) => a.columnIndex - b.columnIndex);

        rowInfos.sort((a, b) => a.rowIndex - b.rowIndex).forEach((r) => {
            columnInfos.forEach((c) => {
                cellInfoList.push({
                    rowIndex: r.rowIndex,
                    columnIndex: c.columnIndex,
                    element: this.getCellElement(this.getRowElement(r.rowIndex), c.columnIndex)
                });
            });

        });
        return <ChangeArgs>{
            cellList: cellInfoList
        };
    }

    private raiseUpdateEvent(rowInfos: Array<RowInfo>, columnInfos: Array<ColumnInfo>): void {
        if (rowInfos.length === 0 || columnInfos.length === 0) {
            return;
        }
        this.raise(VirtualContainerEvent.update, this.createChangeArgs(rowInfos, columnInfos));

    }

    private offsetChange(s, eArgs: OffsetChangeArgs): void {
        if (eArgs.direction === Direction.horizontal) {
            this._container.scrollLeft = eArgs.newOffset;
        } else {
            this._container.scrollTop = eArgs.newOffset;
        }
    }
    //#endregion

}

export interface VirtualContainerConfig {
    element: HTMLDivElement;
    rowCount: number;
    rowHeight?: number;
}

export enum VirtualContainerEvent {
    update = 'update'
}

export interface CellInfo {
    rowIndex: number;
    columnIndex: number;
    element: HTMLDivElement;
}

export interface ChangeArgs extends EventArgs {
    cellList: Array<CellInfo>;
}