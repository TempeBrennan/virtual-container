import { CircularQueue, QueueEvent, IndexChangeArgs } from "../operation-algorithm/circular-queue";
import { VirualContainerService } from "../service/virtual-container.service";

export class VirtualContainer {
    private _container: HTMLDivElement;

    private _rowHeight: number;
    private _columnWidth: number;

    private _actualRowCount: number;
    private _actualColumnCount: number;

    private _virtualRowCount: number;
    private _virtualColumnCount: number;

    private _scrolledRowCount: number = 0;
    private _scrolledColumnCount: number = 0;

    private _service: VirualContainerService;
    private _circulerQueue: CircularQueue;


    constructor(container: HTMLDivElement, rowCount: number, columnCount: number, rowHeight: number = 30, rowWidth: number = 30) {
        this.init(container, rowCount, columnCount, rowHeight, rowWidth);
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
    private initElement(): void {
        this._container.classList.add(this.getContainerClassName());
        var virtualCanvas = this.createVirtualCanvas();
        virtualCanvas.appendChild(this.createVirtualCanvasContent());
        this._container.appendChild(virtualCanvas);
    }

    private createVirtualCanvas(): HTMLDivElement {
        var div = document.createElement('div');
        div.classList.add(this.getVirtualCanvasClassName());
        div.style.position = 'relative';
        div.style.width = `${this._service.getVirtualWidth(this._actualColumnCount, this._columnWidth)}px`;
        div.style.height = `${this._service.getVirtualHeight(this._actualRowCount, this._rowHeight)}px`;
        return div;
    }

    private createVirtualCanvasContent(): DocumentFragment {
        var count = this._virtualRowCount;
        var fragement = document.createDocumentFragment();
        for (var i = 0; i < count; i++) {
            fragement.appendChild(this.createRowElement(i));
        }
        return fragement;
    }

    private createRowElement(rowIndex: number): HTMLDivElement {
        var rowElement = document.createElement('div');
        rowElement.classList.add(this.getRowClassName());
        rowElement.classList.add(this.getRowIndexClassName(rowIndex));
        rowElement.style.position = 'absolute';
        rowElement.style.width = '100%';
        rowElement.style.height = `${this._rowHeight}px`;
        rowElement.style.top = `${this._service.getRowPosition(rowIndex, this._rowHeight)}px`;
        rowElement.appendChild(this.createCellList());
        return rowElement;
    }

    private getRowElement(rowIndex: number): HTMLDivElement {
        return this._container.querySelector(`.${this.getRowIndexClassName(rowIndex)}`);
    }

    private createCellList(): DocumentFragment {
        var count = this._virtualColumnCount;
        var fragement = document.createDocumentFragment();
        for (var i = 0; i < count; i++) {
            fragement.appendChild(this.createCellElement(i));
        }
        return fragement;
    }

    private createCellElement(columnIndex: number): HTMLDivElement {
        var cellElement = document.createElement('div');
        cellElement.classList.add(this.getCellClassName());
        cellElement.classList.add(this.getCellIndexClassName(columnIndex));
        cellElement.style.position = 'absolute';
        cellElement.style.width = `${this._columnWidth}px`;
        cellElement.style.height = `100%`;
        cellElement.style.left = `${this._service.getRowPosition(columnIndex, this._columnWidth)}px`;
        cellElement.innerHTML = columnIndex.toString();
        return cellElement;
    }

    private getCellElement(columnIndex: number): HTMLDivElement {
        return this._container.querySelector(`.${this.getCellIndexClassName(columnIndex)}`);
    }
    //#endregion

    //#region row position
    public updateRowPosition(oldIndex: number, newIndex: number): void {
        var rowElement = this.getRowElement(oldIndex);
        rowElement.classList.remove(this.getRowIndexClassName(oldIndex));
        rowElement.classList.add(this.getRowIndexClassName(newIndex));
        this.setRowPosition(newIndex, this._service.getRowPosition(newIndex, this._rowHeight));
    }

    private setRowPosition(rowIndex: number, top: number): void {
        var ele = this.getRowElement(rowIndex);
        ele.style.top = `${this._service.getRowPosition(rowIndex, this._rowHeight)}px`;
    }

    //#endregion
    private init(container: HTMLDivElement, rowCount: number, columnCount: number, rowHeight: number, columnWidth: number): void {
        this._service = new VirualContainerService();
        this._container = container;

        this._rowHeight = rowHeight;
        this._columnWidth = columnWidth;

        this._actualRowCount = rowCount;
        this._actualColumnCount = columnCount;

        this._virtualRowCount = this._service.getVirtualRowCount(this._container.offsetHeight, this._rowHeight);
        this._virtualColumnCount = this._service.getVirtualColumnCount(this._container.offsetWidth, this._columnWidth);

        this._circulerQueue = new CircularQueue(this._virtualRowCount);

        this.initElement();
        this.bindEvent();
    }

    private bindEvent(): void {
        this._container.addEventListener('scroll', () => this.scroll(this._container.scrollTop));
        this._circulerQueue.addEventListener(QueueEvent.IndexChanged, this.positionChange.bind(this))
    }

    private scroll(offset: number): void {
        if (this._service.isScrollBottom(offset, this._container.offsetHeight, this._actualRowCount, this._rowHeight)) {
            offset = this._service.getScrollBottomOffset(this._container.offsetHeight, this._actualRowCount, this._rowHeight);
        }

        var scrolledRowCount = this._service.getScrolledRowCount(offset, this._rowHeight);
        if (scrolledRowCount === this._scrolledRowCount) {
            return;
        }

        var offsetRowCount = Math.abs(scrolledRowCount - this._scrolledRowCount);
        if (scrolledRowCount > this._scrolledRowCount) {
            this._circulerQueue.moveUp(offsetRowCount);
        } else {
            this._circulerQueue.moveDown(offsetRowCount);
        }

        this._scrolledRowCount = scrolledRowCount;
    }

    private positionChange(sender: CircularQueue, args: IndexChangeArgs): void {
        args.changes.forEach((change) => {
            this.updateRowPosition(change.oldIndex, change.newIndex);
            // this.getRowElement(change.newIndex).innerHTML = change.newIndex.toString();
        });
    }

}