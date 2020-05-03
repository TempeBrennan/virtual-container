import { EventBase } from "../../common/event-base";
import { DataModel, DataModelEvent } from "../model/data-model";
import { VirtualContainerInfo, Direction, EventArgs } from "../../common/common-type";
import { InitInfoArgs, ChangeInfoArgs } from "../algorithm/block-queue";

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

    public resizeRow(rowIndex: number, rowHeight: number): void {
        this._dataModel.changeRowHeight(rowIndex, rowHeight);
    }

    public getCellState(): CellState {
        var state = this._dataModel.getCurrentCellState();
        return {
            totalWidth: state.totalSize,
            cellInfos: state.blocks.map((i) => {
                return {
                    columnIndex: i.index,
                    columnPosition: i.position,
                    columnWidth: i.size
                }
            })
        };
    }

    private bindEvent(): void {
        this._dataModel.addEventListener(DataModelEvent.rowInit, (s, e: InitInfoArgs) => {
            this.raise(ServiceEvent.RowInit, <RowInitArgs>{
                rowCount: e.addInfos.length,
                rowHeight: this._dataModel.getDefaultRowHeight(),
                totalHeight: e.totalSize,
                rowPositions: e.addInfos.map(i => i.position)
            });
        });
        this._dataModel.addEventListener(DataModelEvent.rowChange, (s: any, e: ChangeInfoArgs) => {
            this.raise(ServiceEvent.RowChange, <RowChangeArgs>{
                addRows: e.addInfos.map(i => {
                    return {
                        rowIndex: i.index,
                        position: i.position,
                        rowHeight: i.size
                    };
                }),
                updateRow: e.updateInfos.map(i => {
                    return {
                        oldRowInfo: {
                            rowIndex: i.oldBlockInfo.index,
                            rowHeight: i.oldBlockInfo.size,
                            position: i.oldBlockInfo.position
                        },
                        newRowInfo: {
                            rowIndex: i.newBlockInfo.index,
                            rowHeight: i.newBlockInfo.size,
                            position: i.newBlockInfo.position
                        }
                    };
                }),
                removeRows: e.removeInfos.map(i => { return { rowIndex: i.index } }),
                recycleRows: e.recycleInfos.map(i => {
                    return {
                        oldRowIndex: i.recyleBlockIndex, newRowIndex: i.index,
                        position: i.position, oldRowHeight: i.recycleBlockSize, newRowHeight: i.size
                    }
                })
            });
        });
        this._dataModel.addEventListener(DataModelEvent.colInit, (s, e: InitInfoArgs) => {
            this.raise(ServiceEvent.ColInit, <ColumnInitArgs>{
                colCount: e.addInfos.length,
                colWidth: this._dataModel.getDefaultColWidth(),
                totalWidth: e.totalSize,
                colPositions: e.addInfos.map(i => i.position)
            });
        });
        this._dataModel.addEventListener(DataModelEvent.colChange, (s, e) => {
            console.log(e);
        });
    }

}

export enum ServiceEvent {
    RowInit = 'rowinit',
    ColInit = 'colinit',
    RowChange = 'rowchange',
}

export interface RowInitArgs extends EventArgs {
    rowCount: number;
    rowHeight: number;
    totalHeight: number;
    rowPositions: Array<number>;
}

export interface ColumnInitArgs extends EventArgs {
    colCount: number;
    colWidth: number;
    totalWidth: number;
    colPositions: Array<number>
}

export interface RowChangeArgs extends EventArgs {
    addRows: Array<RowPositionInfo>;
    updateRow: Array<UpdateRowInfo>;
    removeRows: Array<RowInfo>;
    recycleRows: Array<RecycleRowInfo>;
}

export interface DataInfo {
    customData?: object;
}

export interface RowInfo extends DataInfo{
    rowIndex: number;
    rowHeight: number;
}

export interface CellInfo extends DataInfo{
    columnIndex: number;
    columnPosition: number;
    columnWidth: number;
}

export interface RowPositionInfo extends RowInfo {
    position: number;
}

export interface RecycleRowInfo extends EventArgs {
    oldRowIndex: number;
    newRowIndex: number;
    position: number;
    oldRowHeight: number;
    newRowHeight: number;
}

export interface UpdateRowInfo {
    oldRowInfo: RowPositionInfo;
    newRowInfo: RowPositionInfo;
}

export interface CellState {
    totalWidth: number;
    cellInfos: Array<CellInfo>;
}