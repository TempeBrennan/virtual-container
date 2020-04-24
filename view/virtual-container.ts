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
    private _hCirculerQueue: CircularQueue;
    private _vCirculerQueue: CircularQueue;


    constructor(container: HTMLDivElement, rowCount: number, columnCount: number, rowHeight: number = 30, rowWidth: number = 80) {
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

    private getAllRowElements(): NodeListOf<HTMLDivElement> {
        return this._container.querySelectorAll(`.${this.getRowClassName()}`);
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

    private getCellElement(rowElement: HTMLDivElement, columnIndex: number): HTMLDivElement {
        return rowElement.querySelector(`.${this.getCellIndexClassName(columnIndex)}`);
    }
    //#endregion

    //#region row position
    public updateRowPosition(oldIndex: number, newIndex: number): void {
        var rowElement = this.getRowElement(oldIndex);
        rowElement.classList.remove(this.getRowIndexClassName(oldIndex));
        rowElement.classList.add(this.getRowIndexClassName(newIndex));
        this.setRowPosition(newIndex);
    }

    private setRowPosition(rowIndex: number): void {
        var ele = this.getRowElement(rowIndex);
        ele.style.top = `${this._service.getRowPosition(rowIndex, this._rowHeight)}px`;
    }

    public updateCellPosition(rowElement: HTMLDivElement, oldIndex: number, newIndex: number): void {
        var cellElement = this.getCellElement(rowElement, oldIndex);
        cellElement.classList.remove(this.getCellIndexClassName(oldIndex));
        cellElement.classList.add(this.getCellIndexClassName(newIndex));
        this.setCellPosition(rowElement, newIndex);
    }

    private setCellPosition(rowElement: HTMLDivElement, colIndex: number): void {
        var ele = this.getCellElement(rowElement, colIndex);
        ele.style.left = `${this._service.getCellPosition(colIndex, this._columnWidth)}px`;
        ele.innerHTML = colIndex.toString();
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

        this._hCirculerQueue = new CircularQueue(this._virtualRowCount);
        this._vCirculerQueue = new CircularQueue(this._virtualColumnCount);

        this.initElement();
        this.bindEvent();
    }

    private bindEvent(): void {
        this._container.addEventListener('scroll', () => {
            this.verticalScroll(this._container.scrollTop);
            this.horizontalScroll(this._container.scrollLeft);
        });
        this._hCirculerQueue.addEventListener(QueueEvent.IndexChanged, this.rowPositionChange.bind(this))
        this._vCirculerQueue.addEventListener(QueueEvent.IndexChanged, this.colPositionChange.bind(this))
    }

    private verticalScroll(offset: number): void {
        if (this._service.isScrollBottom(offset, this._container.offsetHeight, this._actualRowCount, this._rowHeight)) {
            offset = this._service.getScrollBottomOffset(this._container.offsetHeight, this._actualRowCount, this._rowHeight);
        }

        var scrolledRowCount = this._service.getScrolledRowCount(offset, this._rowHeight);
        if (scrolledRowCount === this._scrolledRowCount) {
            return;
        }

        var offsetRowCount = Math.abs(scrolledRowCount - this._scrolledRowCount);
        if (scrolledRowCount > this._scrolledRowCount) {
            this._hCirculerQueue.moveUp(offsetRowCount);
        } else {
            this._hCirculerQueue.moveDown(offsetRowCount);
        }

        this._scrolledRowCount = scrolledRowCount;
    }

    private horizontalScroll(offset: number): void {
        if (this._service.isScrollBottom(offset, this._container.offsetWidth, this._actualColumnCount, this._columnWidth)) {
            offset = this._service.getScrollBottomOffset(this._container.offsetWidth, this._actualColumnCount, this._columnWidth);
        }

        var scrolledColumnCount = this._service.getScolledColumnCount(offset, this._columnWidth);
        if (scrolledColumnCount === this._scrolledColumnCount) {
            return;
        }

        var offsetRowCount = Math.abs(scrolledColumnCount - this._scrolledColumnCount);
        if (scrolledColumnCount > this._scrolledColumnCount) {
            this._vCirculerQueue.moveUp(offsetRowCount);
        } else {
            this._vCirculerQueue.moveDown(offsetRowCount);
        }

        this._scrolledColumnCount = scrolledColumnCount;
    }

    private rowPositionChange(sender: CircularQueue, args: IndexChangeArgs): void {
        args.changes.forEach((change) => {
            this.updateRowPosition(change.oldIndex, change.newIndex);
        });
    }

    private colPositionChange(sender: CircularQueue, args: IndexChangeArgs): void {
        args.changes.forEach((change) => {
            this.getAllRowElements().forEach(r => this.updateCellPosition(r, change.oldIndex, change.newIndex));
        });
    }

}