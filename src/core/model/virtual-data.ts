import { CircularQueue, QueueEvent, IndexChangeArgs } from "../algorithm/circular-queue";
import { IDictionary } from "../../common/common-type";

export class DataModel {

    private _positionModel: CircularQueue;
    private _appearanceModel: IDictionary<AppearanceInfo> = {};
    private _defaultAppearance: AppearanceInfo;

    constructor(count: number, defaultInfo: AppearanceInfo) {
        this._positionModel = new CircularQueue(count);
        this._defaultAppearance = defaultInfo;
        this._positionModel.addEventListener(QueueEvent.IndexChanged, this.positionChange.bind(this))
    }

    public getItemCount(): number {
        return this._positionModel.getCount();
    }

    public getPosition(index: number): number {
        return this._positionModel.getPosition(index);
    }

    public setAppearanceInfo(index: number, info: AppearanceInfo): void {
        this._appearanceModel[index] = info;
    }

    public getSize(index: number): number {
        var info = this._appearanceModel[index];
        if (info) {
            return info.itemSize;
        } else {
            return this._defaultAppearance.itemSize;
        }
    }

    public getMinSize(): number {
        var minSize = this._defaultAppearance.itemSize;
        for (var k in this._appearanceModel) {
            if (this._appearanceModel[k].itemSize < minSize) {
                minSize = this._appearanceModel[k].itemSize;
            }
        }
        return minSize;
    }

    private positionChange(sender: CircularQueue, args: IndexChangeArgs): void {
        args.changes.forEach((change) => {

        });
    }


}

export interface AppearanceInfo {
    itemSize: number;
}