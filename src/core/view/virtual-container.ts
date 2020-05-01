import { VirtualContainerService, ServiceEvent, RowInitArgs } from "../service/virtual-container.service";
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
        var virtualCanvas = this.createVirtualCanvas(height);
        this._container.appendChild(virtualCanvas);
    }

    private createVirtualCanvas(height: number): HTMLDivElement {
        var div = document.createElement('div');
        div.classList.add(this.getVirtualCanvasClassName());
        div.style.position = 'relative';
        div.style.height = `${height}px`;
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

    private getRowElement(rowIndex: number): HTMLDivElement {
        return this._container.querySelector(`.${this.getRowIndexClassName(rowIndex)}`);
    }

    private getAllRowElements(): NodeListOf<HTMLDivElement> {
        return this._container.querySelectorAll(`.${this.getRowClassName()}`);
    }

    private createCellList(): DocumentFragment {
        // var count = this._virtualColumnCount;
        var fragement = document.createDocumentFragment();
        // for (var i = 0; i < count; i++) {
        //     fragement.appendChild(this.createCellElement(i));
        // }
        return fragement;
    }

    // private createCellElement(columnIndex: number): HTMLDivElement {
    //     var cellElement = document.createElement('div');
    //     cellElement.classList.add(this.getCellClassName());
    //     cellElement.classList.add(this.getCellIndexClassName(columnIndex));
    //     cellElement.style.position = 'absolute';
    //     cellElement.style.width = `${this._columnWidth}px`;
    //     cellElement.style.height = `100%`;
    //     cellElement.style.left = `${this._service.getRowPosition(columnIndex, this._columnWidth)}px`;
    //     cellElement.innerHTML = columnIndex.toString();
    //     return cellElement;
    // }

    private getCellElement(rowElement: HTMLDivElement, columnIndex: number): HTMLDivElement {
        return rowElement.querySelector(`.${this.getCellIndexClassName(columnIndex)}`);
    }
    //#endregion

    //#region row position
    // public updateRowPosition(oldIndex: number, newIndex: number): void {
    //     var rowElement = this.getRowElement(oldIndex);
    //     rowElement.classList.remove(this.getRowIndexClassName(oldIndex));
    //     rowElement.classList.add(this.getRowIndexClassName(newIndex));
    //     this.setRowPosition(newIndex);
    // }

    // private setRowPosition(rowIndex: number): void {
    //     var ele = this.getRowElement(rowIndex);
    //     ele.style.top = `${this._service.getRowPosition(rowIndex, this._rowHeight)}px`;
    // }

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
            this._service.scroll(Direction.horizontal, this._container.offsetLeft);
            this._service.scroll(Direction.vertical, this._container.offsetTop);
        });
    }

    private bindServiceEvent(): void {
        this._service.addEventListener(ServiceEvent.RowInit, (s, e: RowInitArgs) => {
            this.initElement(e.totalHeight);
            this.initRowElement(e.rowPositions, e.rowHeight);
        });
        this._service.addEventListener(ServiceEvent.ColInit, (s, e) => {

        });
    }

}

export interface VirtualContainerConfig {
    element: HTMLDivElement;
    rowCount: number;
    rowHeight?: number;
}