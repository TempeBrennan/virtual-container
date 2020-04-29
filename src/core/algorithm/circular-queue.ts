import { EventArgs } from "../../common/common-type";
import { EventBase } from "../../common/event-base";


export class CircularQueue extends EventBase {
    private _start: number;
    private _end: number;
    private _count: number;

    constructor(count: number) {
        super();
        this._count = count;
        this._start = 0;
        this._end = count - 1;
    }

    public getCount(): number {
        return this._count;
    }

    public getPosition(index: number) {
        return this._start + index;
    }

    public moveUp(offset: number): void {
        var count = this.getMoveCount(offset);
        var changes: Array<IndexChange> = [];
        for (var i = this._start; i < this._start + count; i++) {
            changes.push({
                oldIndex: i,
                newIndex: i + this.getOffset(offset)
            });
        }
        this.raiseEvent(changes);
        this.updatePointer(offset);
    }

    public moveDown(offset: number): void {
        var count = this.getMoveCount(offset);
        var changes: Array<IndexChange> = [];
        for (var i = this._end; i > this._end - count; i--) {
            changes.push({
                oldIndex: i,
                newIndex: i - this.getOffset(offset)
            });
        }
        this.raiseEvent(changes);
        this.updatePointer(-offset);
    }

    private updatePointer(offset: number): void {
        this._start += offset;
        this._end += offset;
    }

    private raiseEvent(changes: Array<IndexChange>): void {
        this.raise(QueueEvent.IndexChanged,
            <IndexChangeArgs>{
                changes: changes
            });
    }

    private getMoveCount(offset: number): number {
        if (offset < this._count) {
            return offset;
        } else {
            return this._count;
        }
    }

    private getOffset(offset: number): number {
        if (offset < this._count) {
            return this._count;
        } else {
            return offset;
        }
    }
}

export interface IndexChangeArgs extends EventArgs {
    changes: Array<IndexChange>;
}

export interface IndexChange {
    oldIndex: number;
    newIndex: number;
}

export enum QueueEvent {
    IndexChanged = 'indexchange'
}