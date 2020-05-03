import { VirtualContainerService, ServiceEvent, RowInitArgs, ColumnInitArgs, RowChangeArgs, CellInfo, CellState } from "../service/virtual-container.service";
import { VirtualContainerInfo, Direction } from "../../common/common-type";

export class VirtualContainer {
    private _container: HTMLDivElement;
    private _service: VirtualContainerService;

    constructor(container: HTMLDivElement, containerInfo: VirtualContainerInfo) {
        this.init(container, containerInfo);
    }

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

    private initRowElement(rowPosition: Array<number>, rowHeight: number): void {
        var virtualCanvas = this._container.querySelector(`.${this.getVirtualCanvasClassName()}`);
        var fragement = document.createDocumentFragment();
        for (var i = 0; i < rowPosition.length; i++) {
            fragement.appendChild(this.createRowElement(i, rowHeight, rowPosition[i]));
        }
        virtualCanvas.appendChild(fragement);
    }

    private insertRowElement(rowIndex: number, rowHeight: number, rowPosition: number, totalWidth: number, cellInfos: Array<CellInfo>): void {
        var virtualCanvas = this._container.querySelector(`.${this.getVirtualCanvasClassName()}`);
        var rowElement = this.createRowElement(rowIndex, rowHeight, rowPosition);

        var rowVirtualCanvas = this.createVirtualCanvas(totalWidth, Direction.horizontal);
        rowVirtualCanvas.appendChild(this.createCellList(cellInfos));
        rowElement.appendChild(rowVirtualCanvas);

        virtualCanvas.appendChild(rowElement);
    }

    private removeRowElement(rowIndex: number): void {
        var virtualCanvas = this._container.querySelector(`.${this.getVirtualCanvasClassName()}`);
        virtualCanvas.removeChild(this.getRowElement(rowIndex));
    }

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

    private createCellList(cellInfos: Array<CellInfo>): DocumentFragment {
        var fragement = document.createDocumentFragment();
        for (var i = 0; i < cellInfos.length; i++) {
            fragement.appendChild(this.createCellElement(i, cellInfos[i].columnWidth, cellInfos[i].position));
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

    private createCellListFragement(columnCount: number, columnWidth: number, columnPositions: Array<number>): DocumentFragment {
        var fragement = document.createDocumentFragment();
        for (var i = 0; i < columnCount; i++) {
            fragement.appendChild(this.createCellElement(i, columnWidth, columnPositions[i]));
        }
        return fragement;
    }

    private createCellElement(columnIndex: number, columnWidth: number, columnPosition: number): HTMLDivElement {
        var cellElement = document.createElement('div');
        cellElement.classList.add(this.getCellClassName());
        cellElement.classList.add(this.getCellIndexClassName(columnIndex));
        cellElement.style.position = 'absolute';
        cellElement.style.width = `${columnWidth}px`;
        cellElement.style.height = `100%`;
        cellElement.style.left = `${columnPosition}px`;
        cellElement.innerHTML = columnIndex.toString();
        return cellElement;
    }

    private getRowElement(rowIndex: number): HTMLDivElement {
        return this._container.querySelector(`.${this.getRowIndexClassName(rowIndex)}`);
    }

    private getAllRowElements(): NodeListOf<HTMLDivElement> {
        return this._container.querySelectorAll(`.${this.getRowClassName()}`);
    }

    private getCellElement(rowElement: HTMLDivElement, columnIndex: number): HTMLDivElement {
        return rowElement.querySelector(`.${this.getCellIndexClassName(columnIndex)}`);
    }
    //#endregion

    //#region row position
    private recycleRow(oldIndex: number, newIndex: number, rowPosition: number): void {
        var rowElement = this.getRowElement(oldIndex);
        rowElement.classList.remove(this.getRowIndexClassName(oldIndex));
        rowElement.classList.add(this.getRowIndexClassName(newIndex));
        this.setRowPosition(newIndex, rowPosition);
    }

    private updateRowHeight(rowIndex: number, rowHeight: number): void {
        var rowElement = this.getRowElement(rowIndex);
        rowElement.style.height = `${rowHeight}px`;
    }

    private setRowPosition(rowIndex: number, rowPosition: number): void {
        var ele = this.getRowElement(rowIndex);
        ele.style.top = `${rowPosition}px`;
    }

    // public updateCellPosition(rowElement: HTMLDivElement, oldIndex: number, newIndex: number): void {
    //     var cellElement = this.getCellElement(rowElement, oldIndex);
    //     cellElement.classList.remove(this.getCellIndexClassName(oldIndex));
    //     cellElement.classList.add(this.getCellIndexClassName(newIndex));
    //     this.setCellPosition(rowElement, newIndex);
    // }

    // private setCellPosition(rowElement: HTMLDivElement, colIndex: number): void {
    //     var ele = this.getCellElement(rowElement, colIndex);
    //     ele.style.left = `${this._service.getCellPosition(colIndex, this._columnWidth)}px`;
    //     ele.innerHTML = colIndex.toString();
    // }

    //#endregion
    private init(container: HTMLDivElement, containerInfo: VirtualContainerInfo): void {
        this._service = new VirtualContainerService(containerInfo);
        this._container = container;
        this.bindElementEvent();
        this.bindServiceEvent();
        this._service.init();
    }

    private bindElementEvent(): void {
        this._container.addEventListener('scroll', () => {
            // this._service.scroll(Direction.horizontal, this._container.scrollLeft);
            this._service.scroll(Direction.vertical, this._container.scrollTop);
        });
    }

    private bindServiceEvent(): void {
        this._service.addEventListener(ServiceEvent.RowInit, this.rowInit.bind(this));
        this._service.addEventListener(ServiceEvent.ColInit, this.columnInit.bind(this));
        this._service.addEventListener(ServiceEvent.RowChange, this.rowChange.bind(this));
    }

    private rowInit(s, e: RowInitArgs): void {
        this.initElement(e.totalHeight);
        this.initRowElement(e.rowPositions, e.rowHeight);
    }

    private columnInit(s, e: ColumnInitArgs): void {
        this.initColumnElement(e.totalWidth, e.colCount, e.colWidth, e.colPositions);
    }

    private rowChange(s, e: RowChangeArgs): void {
        e.recycleRows.forEach((r) => {
            this.recycleRow(r.oldRowIndex, r.newRowIndex, r.position);
            if (r.newRowHeight !== r.oldRowHeight) {
                this.updateRowHeight(r.newRowIndex, r.newRowHeight);
            }
        });
        e.addRows.forEach((r) => {
            var state = this._service.getCellState();
            this.insertRowElement(r.rowIndex, r.rowHeight, r.position, state.totalWidth, state.cellInfos);
        });
        e.updateRow.forEach((r) => {
            if (r.oldRowInfo.rowHeight !== r.newRowInfo.rowHeight) {
                this.updateRowHeight(r.newRowInfo.rowIndex, r.newRowInfo.rowHeight);
            } else if (r.oldRowInfo.position !== r.newRowInfo.position) {
                this.setRowPosition(r.newRowInfo.rowIndex, r.newRowInfo.position);
            }
        });
        e.removeRows.forEach((r) => {
            this.removeRowElement(r.rowIndex);
        });
    }

    public test(offset: number): void {
        this._service.scroll(Direction.vertical, offset);
    }

    public resizeRow(rowIndex: number, rowHeight: number): void {
        this._service.resizeRow(rowIndex, rowHeight);
    }

}

export interface VirtualContainerConfig {
    element: HTMLDivElement;
    rowCount: number;
    rowHeight?: number;
}