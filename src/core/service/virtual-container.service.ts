import { EventBase } from "../../common/event-base";
import { DataModel, DataModelEvent } from "../model/data-model";
import { VirtualContainerInfo, Direction, EventArgs } from "../../common/common-type";
import { InitInfoArgs } from "../algorithm/block-queue";

export class VirtualContainerService extends EventBase {

    private _dataModel: DataModel;

    constructor(containerInfo: VirtualContainerInfo) {
        super();
        this._dataModel = new DataModel(containerInfo);
        this.bindEvent();
    }

    public init(): void {
        this._dataModel.init();
    }

    public scroll(direction: Direction, offset: number): void {
        this._dataModel.scroll(direction, offset);
    }

    private bindEvent(): void {
        this._dataModel.addEventListener(DataModelEvent.rowInit, (s, e: InitInfoArgs) => {
            this.raise(ServiceEvent.RowInit, <RowInitArgs>{
                rowCount: this._dataModel.getRowCount(),
                rowHeight: this._dataModel.getDefaultRowHeight(),
                totalHeight: e.totalSize,
                rowPositions: e.addInfos.map(i => i.position)
            });
        });
        this._dataModel.addEventListener(DataModelEvent.rowChange, (s, e) => {

        });
        this._dataModel.addEventListener(DataModelEvent.colInit, (s, e: InitInfoArgs) => {
            this.raise(ServiceEvent.ColInit, <ColumnInitArgs>{
                rowCount: this._dataModel.getRowCount(),
                colCount: this._dataModel.getColCount(),
                colWidth: this._dataModel.getDefaultColWidth(),
                totalWidth: e.totalSize,
                colPositions: e.addInfos.map(i => i.position)
            });
        });
        this._dataModel.addEventListener(DataModelEvent.colChange, (s, e) => {

        });
    }

}

export enum ServiceEvent {
    RowInit = 'rowinit',
    ColInit = 'colinit',
}

export interface RowInitArgs extends EventArgs {
    rowCount: number;
    rowHeight: number;
    totalHeight: number;
    rowPositions: Array<number>;
}

export interface ColumnInitArgs extends EventArgs {
    rowCount: number;
    colCount: number;
    colWidth: number;
    totalWidth: number;
    colPositions: Array<number>
}