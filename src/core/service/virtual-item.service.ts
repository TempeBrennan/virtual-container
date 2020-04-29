import { EventBase } from "../../common/event-base";
import { DataModel, AppearanceInfo } from "../model/virtual-data";

export class VirtualItemService extends EventBase {

    private _virtualItemCount: number;
    private _actualItemCount: number;
    private _dataModel: DataModel;

    constructor(virtualItemCount: number, actualItemCount: number, defaultAppearanceInfo: AppearanceInfo) {
        super();
        this._virtualItemCount = virtualItemCount;
        this._actualItemCount = actualItemCount;
        this._dataModel = new DataModel(virtualItemCount, defaultAppearanceInfo);
    }

    public getMovedItemCount(offset: number): number {
        var totalSize: number = 0;
        for (var i = 0; i < this._actualItemCount; i++) {
            var itemSize = this._dataModel.getSize(i);

            /**Current item has not been moved yet. */
            if (totalSize + itemSize > offset) {
                return i;
            }
        }
        return 0;
    }

    private getVirtualItemCount(): number {
        return this._dataModel.getMinSize() + 2;
    }

}

export enum MoveDirection {
    forward,
    back
}