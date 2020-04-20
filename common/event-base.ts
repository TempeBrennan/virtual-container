import { IDictionary, EventArgs } from "./common-type";

export class EventBase {
    private _eventDictionary: IDictionary<Array<Function>> = {};

    public addEventListener(name: string, fn: Function): void {
        if (!Array.isArray(this._eventDictionary[name])) {
            this._eventDictionary[name] = [];
        }

        if (this._eventDictionary[name].indexOf(fn) !== -1) {
            return;
        }

        this._eventDictionary[name].push(fn);
    }

    public removeEventListener(name: string, fn: Function): void {
        if (!Array.isArray(this._eventDictionary[name])) {
            return;
        }

        var index = this._eventDictionary[name].indexOf(fn);
        if (index === -1) {
            return;
        }

        this._eventDictionary[name].splice(index, 1);
    }

    protected raise(name: string, args: EventArgs): void {
        var handlers = this._eventDictionary[name];
        if (!Array.isArray(handlers) || handlers.length === 0) {
            return;
        }

        args.name = name;
        handlers.forEach((fn) => {
            fn(this, args);
        });
    }
}