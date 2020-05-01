export class ArrayHelper {

    public static find<T>(arr: Array<T>, func: (i: T) => boolean): T {
        var result = arr.filter(func);
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    }

    public static findIndex<T>(arr: Array<T>, func: (i: T) => boolean): number {
        var result = ArrayHelper.find(arr, func);
        if (result) {
            return arr.indexOf(result);
        } else {
            return -1;
        }
    }

    public static sum(arr: Array<number>): number {
        return arr.reduce((pre, cur) => {
            return pre + cur;
        });
    }

    public static take<T>(arr: Array<T>, count: number): Array<T> {
        return arr.slice(0, count);
    }
}