import { EventBase } from "../../common/event-base";
import { BlockQueue, BlockEvent, CurrentBlocks } from "../algorithm/block-queue";
import { VirtualContainerInfo, Direction } from "../../common/common-type";

export class DataModel extends EventBase {
    private _rowModel: BlockQueue;
    private _colModel: BlockQueue;

    constructor(containerInfo: VirtualContainerInfo) {
        super();
        this.initModel(containerInfo);
        this.bindEvent();
    }

    //#region Public
    public init(): void {
        this._rowModel.init();
        this._colModel.init();
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

    public getColumnState(): CurrentBlocks {
        return this._colModel.getCurrentBlockState();
    }

    public getRowState(): CurrentBlocks {
        return this._rowModel.getCurrentBlockState();
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
    //#endregion

    private initModel(containerInfo: VirtualContainerInfo): void {
        this._rowModel = new BlockQueue(containerInfo.rowCount, containerInfo.height, { size: containerInfo.rowHeight });
        this._colModel = new BlockQueue(containerInfo.colCount, containerInfo.width, { size: containerInfo.colWidth });
    }

    private bindEvent(): void {
        this._rowModel.addEventListener(BlockEvent.init, (s, e) => this.raise(DataModelEvent.rowInit, e));
        this._rowModel.addEventListener(BlockEvent.change, (s, e) => this.raise(DataModelEvent.rowChange, e));
        this._colModel.addEventListener(BlockEvent.init, (s, e) => this.raise(DataModelEvent.colInit, e));
        this._colModel.addEventListener(BlockEvent.change, (s, e) => this.raise(DataModelEvent.colChange, e));
    }
}

export enum DataModelEvent {
    rowInit = 'rowinit',
    colInit = 'colinit',
    rowChange = 'rowchange',
    colChange = 'colChange'
}