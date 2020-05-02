import { ArrayHelper } from "../../common/array-helper";
import { EventBase } from "../../common/event-base";
import { EventArgs } from "../../common/common-type";

export class BlockQueue extends EventBase {
    private _sizeArr: Array<BlockInfo> = [];
    private _count: number;
    private _defaultSize: number;
    private _containerSize: number;
    private _offset: number;

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

    public move(offset: number): void {
        if (this._offset === offset) {
            return;
        }

        var preSnapShoot = this.getSnapShoot(this._offset);
        const curSnapShoot = this.getSnapShoot(offset);

        var addInfos: Array<BlockPosition> = [];
        var removeInfos: Array<BlockPosition> = [];
        var updateInfos: Array<UpdateBlockInfo> = [];

        var blockChangeInfo = this.getBlockChangeInfo(preSnapShoot, curSnapShoot);
        var newVisibleBlocks = blockChangeInfo.newVisibleBlocks;
        var oldRecycleBlocks = blockChangeInfo.oldRecycleBlocks;

        newVisibleBlocks.forEach(i => {
            if (oldRecycleBlocks.length > 0) {
                /**First use recyle Block */
                updateInfos.push({
                    recyleBlockIndex: oldRecycleBlocks.pop().index,
                    index: i.index,
                    position: i.position
                });
            } else {
                /**No recyle Block, have to create new Block */
                addInfos.push({
                    index: i.index,
                    position: i.position
                });
            }
        });

        /**If still have remain block,  discard those blocks */
        oldRecycleBlocks.forEach(i => {
            removeInfos.push({
                index: i.index,
                position: i.position
            });
        });

        this._offset = offset;
        this.raise(BlockEvent.change, <ChangeInfoArgs>{
            addInfos: addInfos,
            updateInfos: updateInfos,
            removeInfos: removeInfos,
        });
    }

    public init(): void {
        this._offset = 0;
        var snapShoot = this.getSnapShoot(0);
        this.raise(BlockEvent.init, <InitInfoArgs>{
            addInfos: snapShoot.visibleBlocks.map((i) => { return { index: i.index, position: i.position } }),
            totalSize: this.getTotalSize()
        });
    }

    //#region BlockInfo
    private getBlockChangeInfo(pre: SnapShoot, cur: SnapShoot): BlockChangeInfo {
        var visibleBlockIndex: Array<number> = [];
        var newVisibleBlocks: Array<BlockPosition> = [];
        var oldRecycleBlocks: Array<BlockPosition> = [];

        cur.visibleBlocks.forEach(block => {
            var index = ArrayHelper.findIndex(pre.visibleBlocks, b => b.index === block.index);
            if (index !== -1) {
                /**Block is still visible */
                visibleBlockIndex.push(index);
            } else {
                /**New visible Block is shown*/
                newVisibleBlocks.push({
                    index: block.index,
                    position: block.position
                })
            }
        });

        /**Get Block is invisible in the current snapshoot and make it recycle*/
        var oldFreeBlock = pre.visibleBlocks.filter(i => visibleBlockIndex.indexOf(i.index) === -1);
        oldFreeBlock.forEach(i => oldRecycleBlocks.push({
            index: i.index,
            position: i.position
        }));

        return {
            oldRecycleBlocks: oldRecycleBlocks,
            newVisibleBlocks: newVisibleBlocks
        }
    }

    private getSnapShoot(offset: number): SnapShoot {
        var head = this.getHeadBlockInfo(offset);
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

    private getHeadBlockInfo(offset: number): HeadBlockInfo {
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
    //#endregion
}

export interface BlockPosition {
    index: number;
    position: number;
}

export interface UpdateBlockInfo extends BlockPosition {
    recyleBlockIndex: number;
}
export interface ChangeInfoArgs extends EventArgs {
    addInfos: Array<BlockPosition>;
    removeInfos: Array<BlockPosition>;
    updateInfos: Array<UpdateBlockInfo>;
}

export interface InitInfoArgs extends EventArgs {
    addInfos: Array<BlockPosition>;
    totalSize: number;
}

export enum BlockEvent {
    change = 'change',
    init = 'init'
}

interface BlockInfo {
    index: number;
    size: number;
}

interface SnapShoot {
    visibleBlocks: Array<BlockPosition>;
}

interface HeadBlockInfo {
    index: number;
    cover: number;
}

interface BlockChangeInfo {
    newVisibleBlocks: Array<BlockPosition>;
    oldRecycleBlocks: Array<BlockPosition>;
}