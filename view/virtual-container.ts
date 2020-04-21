import { CircularQueue, QueueEvent, IndexChangeArgs } from "../operation-algorithm/circular-queue";
import { VirualContainerService } from "../service/virtual-container.service";

export class VirtualContainer {
    private _data: CircularQueue;
    private _rowHeight: number;
    private _container: HTMLDivElement;
    private _scrolledRowCount: number = 0;
    private _actualRowCount: number;
    private _virtualRowCount: number;

    private _service: VirualContainerService;
    private _circulerQueue: CircularQueue;


    constructor(container: HTMLDivElement, rowCount: number, rowHeight: number = 30) {
        this.init(container, rowCount, rowHeight);
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

    private getRowIndexClassName(rowIndex: number): string {
        return `virtual-container-r${rowIndex}`;
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
        div.style.width = '100%';
        div.style.height = this._service.getVirtualHeight(this._actualRowCount, this._rowHeight) + 'px';
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
        return rowElement;
    }

    private getRowElement(rowIndex: number): HTMLDivElement {
        return this._container.querySelector(`.${this.getRowIndexClassName(rowIndex)}`);
    }
    //#endregion

    //#region row position
    public updateRowPosition(oldIndex: number, newIndex: number): void {
        var rowElement = this.getRowElement(oldIndex);
        rowElement.classList.remove(`r${oldIndex}`);
        rowElement.classList.add(`r${newIndex}`);
        this.setRowPosition(newIndex, this._service.getRowPosition(newIndex, this._rowHeight));
    }

    private setRowPosition(rowIndex: number, top: number): void {
        var ele = this.getRowElement(rowIndex);
        ele.style.top = `${this._service.getRowPosition(rowIndex, this._rowHeight)}px`;
    }

    //#endregion

    private init(container: HTMLDivElement, rowCount: number, rowHeight: number): void {
        this._container = container;
        this._rowHeight = rowHeight;
        this._actualRowCount = rowCount;
        this._virtualRowCount = this._service.getVirtualRowCount(this._container.offsetHeight, this._rowHeight);
        this._circulerQueue = new CircularQueue(this._virtualRowCount);

        this.initElement();
        this.bindEvent();
    }

    private bindEvent(): void {
        this._container.addEventListener('scroll', () => this.scroll(this._container.scrollTop));
        this._circulerQueue.addEventListener(QueueEvent.IndexChanged, this.positionChange.bind(this))
    }

    private scroll(offset: number): void {
        if (this._service.isScrollBottom(offset, this._container.offsetHeight, this._virtualRowCount, this._rowHeight)) {
            offset = this._service.getScrollBottomOffset(this._container.offsetHeight, this._virtualRowCount, this._rowHeight);
        }

        var scrolledRowCount = this._service.getScrolledRowCount(offset, this._rowHeight);

        if (scrolledRowCount === this._scrolledRowCount) {
            return;
        }

        var offsetRowCount = Math.abs(scrolledRowCount - this._scrolledRowCount);
        if (scrolledRowCount > this._scrolledRowCount) {
            this._data.moveUp(offsetRowCount);
        } else {
            this._data.moveDown(offsetRowCount);
        }

        this._scrolledRowCount = scrolledRowCount;
    }

    private positionChange(sender: CircularQueue, args: IndexChangeArgs): void {
        this.updateRowPosition(args.oldIndex, args.newIndex);
    }

}