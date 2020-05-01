import { EventBase } from "../../common/event-base";
import { BlockQueue, BlockEvent } from "../algorithm/block-queue";
import { VirtualContainerInfo, Direction } from "../../common/common-type";

export class DataModel extends EventBase {
    private _rowModel: BlockQueue;
    private _colModel: BlockQueue;

    constructor(containerInfo: VirtualContainerInfo) {
        super();
        this.init(containerInfo);
        this.bindEvent();
    }

    public initRow(): void {
        this._rowModel.init();
    }

    public getRowCount(): number {
        return this._rowModel.getCount();
    }

    public getDefaultRowHeight(): number {
        return this._rowModel.getDefaultSize();
    }

    public getColCount(): number {
        return this._colModel.getCount();
    }

    public getDefaultColWidth(): number {
        return this._colModel.getDefaultSize();
    }

    public scroll(direction: Direction, offset: number): void {
        if (direction === Direction.horizontal) {
            this._colModel.move(offset);
        } else {
            this._rowModel.move(offset);
        }
    }

    public changeRowHeight(rowIndex: number, rowHeight: number): void {
        this._rowModel.setBlockSize(rowIndex, rowHeight);
    }

    public changeColumnWidth(colIndex: number, colWidth: number): void {
        this._colModel.setBlockSize(colIndex, colWidth);
    }

    private init(containerInfo: VirtualContainerInfo): void {
        this._rowModel = new BlockQueue(containerInfo.rowCount, containerInfo.rowHeight, containerInfo.height);
        this._colModel = new BlockQueue(containerInfo.colCount, containerInfo.colWidth, containerInfo.width);
    }

    private bindEvent(): void {
        this._rowModel.addEventListener(BlockEvent.init, (s, e) => {
            this.raise(DataModelEvent.rowInit, e);
        });
        this._rowModel.addEventListener(BlockEvent.change, (s, e) => this.raise(DataModelEvent.rowChange, e))
        this._colModel.addEventListener(BlockEvent.init, (s, e) => this.raise(DataModelEvent.rowInit, e))
        this._colModel.addEventListener(BlockEvent.change, (s, e) => this.raise(DataModelEvent.colChange, e))
    }
}

export enum DataModelEvent {
    rowInit = 'rowinit',
    colInit = 'colinit',
    rowChange = 'rowchange',
    colChange = 'colChange'
}