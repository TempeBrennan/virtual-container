import { ArrayHelper } from "../../common/array-helper";
import { EventBase } from "../../common/event-base";
import { EventArgs } from "../../common/common-type";

export class BlockQueue extends EventBase {
    private _blockInfo: Array<BlockInfo> = [];
    private _count: number;
    private _defaultBlockInfo: BlockDataInfo;
    private _containerSize: number;
    private _offset: number;
    private _snapShoot: SnapShoot;

    constructor(count: number, containerSize: number, defaultBlockInfo: BlockDataInfo) {
        super();
        this._count = count;
        this._containerSize = containerSize;
        this._defaultBlockInfo = defaultBlockInfo;
    }

    //#region Public
    public getDefaultSize(): number {
        return this._defaultBlockInfo.size;
    }

    public getBlockTag(index: number): object {
        return this.getBlockInfo(index).tag;
    }

    public getCount(): number {
        return this._count;
    }

    public setBlockSize(index: number, size: number): void {
        if (index < 0 || index >= this._count) {
            return;
        }

        var result = ArrayHelper.find(this._blockInfo, i => i.index === index);
        if (result) {
            result.size = size;
        } else {
            this._blockInfo.push({
                index: index,
                size: size
            });
        }
        this.move(this._offset);
    }

    public move(offset: number): void {
        const preSnapShoot = this._snapShoot;
        const curSnapShoot = this.getSnapShoot(offset);

        var addInfos: Array<BlockPosition> = [];
        var removeInfos: Array<BlockPosition> = [];
        var recycleInfos: Array<RecycleBlockInfo> = [];

        var blockChangeInfo = this.getBlockChangeInfo(preSnapShoot, curSnapShoot);
        var newVisibleBlocks = blockChangeInfo.newVisibleBlocks;
        var oldRecycleBlocks = blockChangeInfo.oldRecycleBlocks;

        newVisibleBlocks.forEach(i => {
            if (oldRecycleBlocks.length > 0) {
                /**First use recyle Block */
                var oldRecyleBlock = oldRecycleBlocks.pop();
                recycleInfos.push({
                    recyleBlockIndex: oldRecyleBlock.index,
                    recycleBlockSize: oldRecyleBlock.size,
                    index: i.index,
                    position: i.position,
                    size: i.size
                });
            } else {
                /**No recyle Block, have to create new Block */
                addInfos.push({
                    index: i.index,
                    position: i.position,
                    size: i.size
                });
            }
        });

        /**If still have remain block,  discard those blocks */
        oldRecycleBlocks.forEach(i => {
            removeInfos.push({
                index: i.index,
                position: i.position,
                size: i.size
            });
        });

        this._offset = offset;
        this._snapShoot = curSnapShoot;
        this.raise(BlockEvent.change, <ChangeInfoArgs>{
            addInfos: addInfos,
            updateInfos: blockChangeInfo.updateVisibleBlocks,
            removeInfos: removeInfos,
            recycleInfos: recycleInfos,
        });
    }

    public init(): void {
        this._offset = 0;
        var snapShoot = this.getSnapShoot(0);
        this._snapShoot = snapShoot;
        this.raise(BlockEvent.init, <InitInfoArgs>{
            addInfos: snapShoot.visibleBlocks.map((i) => { return { index: i.index, position: i.position } }),
            totalSize: this.getTotalSize()
        });
    }

    public getCurrentBlockState(): CurrentBlocks {
        return {
            blocks: this._snapShoot.visibleBlocks,
            totalSize: this.getTotalSize()
        }
    }
    //#endregion

    //#region BlockInfo
    private getBlockInfo(index: number): BlockDataInfo {
        if (index < 0 || index >= this._count) {
            return null;
        }

        var result = ArrayHelper.find(this._blockInfo, i => i.index === index);
        if (result) {
            return result;
        } else {
            return this._defaultBlockInfo;
        }
    }

    private getBlockChangeInfo(pre: SnapShoot, cur: SnapShoot): BlockChangeInfo {
        var visibleBlockIndex: Array<number> = [];
        var newVisibleBlocks: Array<BlockPosition> = [];
        var updateVisibleBlocks: Array<UpdateBlockInfo> = [];
        var oldRecycleBlocks: Array<BlockPosition> = [];

        cur.visibleBlocks.forEach(newBlock => {
            var oldBlock = ArrayHelper.find(pre.visibleBlocks, b => b.index === newBlock.index);
            if (oldBlock) {
                /**Block is still visible */
                if (oldBlock.size !== newBlock.size || oldBlock.position !== newBlock.position) {
                    updateVisibleBlocks.push({
                        oldBlockInfo: {
                            index: oldBlock.index,
                            position: oldBlock.position,
                            size: oldBlock.size
                        },
                        newBlockInfo: {
                            index: newBlock.index,
                            position: newBlock.position,
                            size: newBlock.size
                        },
                    });
                }
                visibleBlockIndex.push(oldBlock.index);
            } else {
                /**New visible Block is shown*/
                newVisibleBlocks.push({
                    index: newBlock.index,
                    position: newBlock.position,
                    size: newBlock.size
                })
            }
        });

        /**Get Block is invisible in the current snapshoot and make it recycle*/
        var oldFreeBlock = pre.visibleBlocks.filter(i => visibleBlockIndex.indexOf(i.index) === -1);
        oldFreeBlock.forEach(i => oldRecycleBlocks.push({
            index: i.index,
            position: i.position,
            size: i.size
        }));

        return {
            oldRecycleBlocks: oldRecycleBlocks,
            newVisibleBlocks: newVisibleBlocks,
            updateVisibleBlocks: updateVisibleBlocks
        }
    }

    private getSnapShoot(offset: number): SnapShoot {
        var head = this.getHeadBlockInfo(offset);
        var visibleSize = head.cover === 0 ? this.getBlockInfo(head.index).size : head.cover;
        var snapShoot = <SnapShoot>{
            visibleBlocks: [
                {
                    index: head.index,
                    position: this.getBlockPosition(head.index),
                    size: this.getBlockInfo(head.index).size
                }
            ]
        };

        var last = false;
        for (var i = head.index + 1; i < this._count; i++) {
            if (last) {
                return snapShoot;
            }

            /**Got the last visible block*/
            if (visibleSize > this._containerSize) {
                last = true;
            }

            var size = this.getBlockInfo(i).size;
            visibleSize += size;
            snapShoot.visibleBlocks.push({
                index: i,
                position: this.getBlockPosition(i),
                size: size
            });
        }
        return snapShoot;
    }

    private getBlockPosition(index: number): number {
        var position = 0;
        for (var i = 0; i < index; i++) {
            position += this.getBlockInfo(i).size;
        }
        return position;
    }

    private getHeadBlockInfo(offset: number): HeadBlockInfo {
        var totalSize = 0;
        for (var i = 0; i < this._count; i++) {
            totalSize += this.getBlockInfo(i).size;
            if (totalSize > offset) {
                return {
                    /**Enlarge one Block to make smooth transition*/
                    index: i > 0 ? i - 1 : i,
                    cover: totalSize - offset
                };
            } else if (totalSize == offset) {
                return {
                    /**Enlarge one Block to make smooth transition*/
                    index: i > 0 ? i : i + 1,
                    cover: 0
                };
            }
        }
    }

    private getTotalSize(): number {
        var total = 0;
        for (var i = 0; i < this._count; i++) {
            total += this.getBlockInfo(i).size;
        }
        return total;
    }
    //#endregion
}

export interface BlockPosition {
    index: number;
    position: number;
    size: number;
}

export interface CurrentBlocks {
    blocks: Array<BlockPosition>;
    totalSize: number;
}

export interface RecycleBlockInfo extends BlockPosition {
    recyleBlockIndex: number;
    recycleBlockSize: number;
}

export interface UpdateBlockInfo {
    oldBlockInfo: BlockPosition;
    newBlockInfo: BlockPosition;
}

export interface ChangeInfoArgs extends EventArgs {
    addInfos: Array<BlockPosition>;
    updateInfos: Array<UpdateBlockInfo>;
    removeInfos: Array<BlockPosition>;
    recycleInfos: Array<RecycleBlockInfo>;
}

export interface InitInfoArgs extends EventArgs {
    addInfos: Array<BlockPosition>;
    totalSize: number;
}

export enum BlockEvent {
    change = 'change',
    init = 'init'
}

interface BlockDataInfo {
    size: number;
    tag?: object;
}

interface BlockInfo extends BlockDataInfo {
    index: number;
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
    updateVisibleBlocks: Array<UpdateBlockInfo>;
}