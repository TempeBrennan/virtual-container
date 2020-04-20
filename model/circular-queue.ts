import { EventArgs } from "../common/common-type";
import { EventBase } from "../common/event-base";


export class CircularQueue extends EventBase{
    private _data: Array<number> = [];

    constructor(count: number) {
        super();
        this._data = this.createData(count);
    }

    public moveUp(offset: number): void {
        for (var i = 0; i < offset; i++) {
            var head = this._data.shift();
            var tail = this.getTail();
            var newTail = ++tail;
            this._data.push(newTail);
            this.raise(QueueEvent.IndexChanged,
                <IndexChangeArgs>{
                    oldIndex: head,
                    newIndex: tail
                });
        }
    }

    public moveDown(offset: number): void {
        for (var i = 0; i < offset; i++) {
            var tail = this._data.pop();
            var head = this.getHead();
            var newHead = --head;
            this._data.unshift(newHead);
            this.raise(QueueEvent.IndexChanged,
                <IndexChangeArgs>{
                    oldIndex: tail,
                    newIndex: head
                });
        }
    }

    private getHead(): number {
        return this._data[0];
    }

    private getTail(): number {
        return this._data[this._data.length - 1];
    }

    private createData(count: number): Array<number> {
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push(i);
        }
        return data;
    }
}

export interface IndexChangeArgs extends EventArgs {
    oldIndex: number;
    newIndex: number;
}

export enum QueueEvent {
    IndexChanged = 'indexchange'
}