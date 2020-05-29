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

    //#region Public
    public init(): void {
        this._dataModel.init();
    }

    public scroll(direction: Direction, offset: number): void {
        this._dataModel.scroll(direction, offset);
    }

    public resizeRow(rowIndex: number, rowHeight: number): void {
        this._dataModel.changeRowHeight(rowIndex, rowHeight);
    }

    public resizeColumn(columnIndex: number, columnWidth: number): void {
        this._dataModel.changeColumnWidth(columnIndex, columnWidth);
    }

    public getColumnState(): ColumnState {
        var state = this._dataModel.getColumnState();
        return {
            totalWidth: state.totalSize,
            columnInfos: state.blocks.map((i) => {
                return {
                    columnIndex: i.index,
                    position: i.position,
                    columnWidth: i.size
                }
            })
        };
    }

    public getRowState(): RowState {
        var state = this._dataModel.getRowState();
        return {
            totalHeight: state.totalSize,
            rowInfos: state.blocks.map((i) => {
                return {
                    rowIndex: i.index,
                    position: i.position,
                    rowHeight: i.size
                }
            })
        };
    }
    //#endregion

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
                updateRows: e.updateInfos.map(i => {
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
                totalSize: e.totalSize
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
        this._dataModel.addEventListener(DataModelEvent.colChange, (s, e: ChangeInfoArgs) => {
            this.raise(ServiceEvent.ColChange, <ColumnChangeArgs>{
                addColumns: e.addInfos.map(i => {
                    return {
                        columnIndex: i.index,
                        position: i.position,
                        columnWidth: i.size
                    };
                }),
                updateColumns: e.updateInfos.map(i => {
                    return {
                        oldColumnInfo: {
                            columnIndex: i.oldBlockInfo.index,
                            columnWidth: i.oldBlockInfo.size,
                            position: i.oldBlockInfo.position
                        },
                        newColumnInfo: {
                            columnIndex: i.newBlockInfo.index,
                            columnWidth: i.newBlockInfo.size,
                            position: i.newBlockInfo.position
                        }
                    };
                }),
                removeColumns: e.removeInfos.map(i => { return { columnIndex: i.index } }),
                totalSize: e.totalSize
            });
        });
        this._dataModel.addEventListener(DataModelEvent.horizontalOffsetChange, (s, e: OffsetChangeArgs) => {
            this.raise(ServiceEvent.OffsetChange, <OffsetChangeArgs>{
                direction: Direction.horizontal,
                oldOffset: e.oldOffset,
                newOffset: e.newOffset
            });
        });
        this._dataModel.addEventListener(DataModelEvent.verticalOffsetChange, (s, e: OffsetChangeArgs) => {
            this.raise(ServiceEvent.OffsetChange, <OffsetChangeArgs>{
                direction: Direction.vertical,
                oldOffset: e.oldOffset,
                newOffset: e.newOffset
            });
        });
    }

}

export enum ServiceEvent {
    RowInit = 'rowinit',
    ColInit = 'colinit',
    RowChange = 'rowchange',
    ColChange = 'colchange',
    OffsetChange = 'offsetchange'
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
    addRows: Array<RowInfo>;
    updateRows: Array<UpdateRowInfo>;
    removeRows: Array<RowInfo>;
    totalSize: number;
}

export interface ColumnChangeArgs extends EventArgs {
    addColumns: Array<ColumnInfo>;
    updateColumns: Array<UpdateColumnInfo>;
    removeColumns: Array<ColumnInfo>;
    totalSize: number;
}

export interface DataInfo {
    position: number;
    customData?: object;
}

export interface RowInfo extends DataInfo {
    rowIndex: number;
    rowHeight: number;
}

export interface ColumnInfo extends DataInfo {
    columnIndex: number;
    columnWidth: number;
}

export interface UpdateRowInfo {
    oldRowInfo: RowInfo;
    newRowInfo: RowInfo;
}

export interface UpdateColumnInfo {
    oldColumnInfo: ColumnInfo;
    newColumnInfo: ColumnInfo;
}

export interface ColumnState {
    totalWidth: number;
    columnInfos: Array<ColumnInfo>;
}

export interface RowState {
    totalHeight: number;
    rowInfos: Array<RowInfo>;
}

export interface OffsetChangeArgs extends EventArgs {
    direction: Direction,
    oldOffset: number;
    newOffset: number;
}