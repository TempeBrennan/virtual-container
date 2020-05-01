import { ArrayHelper } from "../../common/array-helper";
import { EventBase } from "../../common/event-base";
import { EventArgs } from "../../common/common-type";

export class BlockQueue extends EventBase {
    private _sizeArr: Array<ItemData> = [];
    private _count: number;
    private _defaultSize: number;
    private _containerSize: number;
    private _offset: number = 0;

    constructor(count: number, defaultSize: number, containerSize: number) {
        super();
        this._count = count;
        this._defaultSize = defaultSize;
        this._containerSize = containerSize;
    }

    public getDefaultSize(): number {
        return this._defaultSize;
    }

    public getCount(): number {
        return this._count;
    }

    public setBlockSize(index: number, size: number): void {
        if (index < 0 || index >= this._count) {
            return;
        }

        var result = ArrayHelper.find(this._sizeArr, i => i.index === index);
        if (result) {
            result.size = size;
        } else {
            this._sizeArr.push({
                index: index,
                size: size
            });
        }
    }

    public getBlockSize(index: number): number {
        if (index < 0 || index >= this._count) {
            return 0;
        }

        var result = ArrayHelper.find(this._sizeArr, i => i.index === index);
        if (result) {
            return result.size;
        } else {
            return this._defaultSize;
        }
    }

    public move(offset: number, init = false): void {
        // if (this._offset === offset) {
        //     return;
        // }

        var preSnapShoot = this.getSnapShoot(this._offset);
        const curSnapShoot = this.getSnapShoot(offset);
        var newBlocks: Array<AddInfo> = [];
        var addInfos: Array<AddInfo> = [];
        var removeInfos: Array<RemoveInfo> = [];
        var updateInfos: Array<UpdateInfo> = [];

        curSnapShoot.visibleBlocks.forEach(block => {
            var index = ArrayHelper.findIndex(preSnapShoot.visibleBlocks, b => b.index === block.index);
            if (index !== -1) {
                preSnapShoot.visibleBlocks.splice(index, 1);
            } else {
                newBlocks.push({ targetIndex: block.index, position: this.getBlockPosition(block.position) });
            }
        });

        if (preSnapShoot.visibleBlocks.length > 0) {
            preSnapShoot.visibleBlocks.forEach((b) => {
                if (newBlocks.length === 0) {
                    return;
                }

                var block = newBlocks.pop();
                updateInfos.push({
                    recyleIndex: b.index,
                    targetIndex: block.targetIndex,
                    position: block.position
                });
            });
        }

        if (preSnapShoot.visibleBlocks.length > 0) {
            removeInfos = preSnapShoot.visibleBlocks.map(b => { return { targetIndex: b.index }; });
        }
        if (newBlocks.length > 0) {
            addInfos = newBlocks.map(i => { return { targetIndex: i.targetIndex, position: i.position }; });
        }

        this._offset = offset;
        if (init) {
            this.raise(BlockEvent.init, <InitInfoArgs>{
                addInfos: addInfos,
                totalSize: this.getTotalSize()
            });
        } else {
            this.raise(BlockEvent.change, <ChangeInfoArgs>{
                addInfos: addInfos,
                updateInfos: updateInfos,
                removeInfos: removeInfos,
            });
        }
    }

    public init(): void {
        this.move(0, true);
    }

    private getSnapShoot(offset: number): SnapShoot {
        var head = this.getHead(offset);
        var visibleSize = head.cover === 0 ? this.getBlockSize(head.index) : head.cover;
        var snapShoot = <SnapShoot>{
            visibleBlocks: [
                {
                    index: head.index,
                    position: this.getBlockPosition(head.index)
                }
            ]
        };

        for (var i = head.index + 1; i < this._count; i++) {

            /**Got the last visible block*/
            if (visibleSize >= this._containerSize) {
                return snapShoot;
            }

            visibleSize += this.getBlockSize(i);
            snapShoot.visibleBlocks.push({
                index: i,
                position: this.getBlockPosition(i)
            });
        }
        return snapShoot;
    }

    private getBlockPosition(index: number): number {
        var position = 0;
        for (var i = 0; i < index; i++) {
            position += this.getBlockSize(i);
        }
        return position;
    }

    private getHead(offset: number): HeadInfo {
        var totalSize = 0;
        for (var i = 0; i < this._count; i++) {
            totalSize += this.getBlockSize(i);
            if (totalSize > offset) {
                return {
                    index: i,
                    cover: totalSize - offset
                };
            } else if (totalSize == offset) {
                return {
                    index: i + 1,
                    cover: 0
                };
            }
        }
    }

    private getTotalSize(): number {
        var total = 0;
        for (var i = 0; i < this._count; i++) {
            total += this.getBlockSize(i);
        }
        return total;
    }
}

interface ItemData {
    index: number;
    size: number;
}

interface ItemPosition {
    index: number;
    position: number;
}

interface SnapShoot {
    visibleBlocks: Array<ItemPosition>;
}

interface HeadInfo {
    index: number;
    cover: number;
}

export interface UpdateInfo {
    recyleIndex: number;
    targetIndex: number;
    position: number;
}

export interface AddInfo {
    targetIndex: number;
    position: number;
}

export interface RemoveInfo {
    targetIndex: number;
}

export interface ChangeInfoArgs extends EventArgs {
    addInfos: Array<AddInfo>;
    removeInfos: Array<RemoveInfo>;
    updateInfos: Array<UpdateInfo>;
}

export interface InitInfoArgs extends EventArgs {
    addInfos: Array<AddInfo>;
    totalSize: number;
}

export enum BlockEvent {
    change = 'change',
    init = 'init'
}