
export class VirualContainerService {

    public getRowPosition(rowIndex: number, rowHeight: number): number {
        return rowIndex * rowHeight;
    }

    public getCellPosition(columnIndex: number, columnWidth: number): number {
        return columnIndex * columnWidth;
    }

    public getVirtualRowCount(containerHeight: number, rowHeight: number): number {
        return Math.round(containerHeight / rowHeight) + 2;
    }

    public getVirtualColumnCount(containerWidth: number, columnWidth: number): number {
        return Math.round(containerWidth / columnWidth) + 2;
    }

    public getScrolledRowCount(offset: number, rowHeight: number): number {
        return Math.floor(offset / rowHeight);
    }

    public isScrollBottom(offset: number, containerHeight: number, actualRowCount: number, rowHeight: number): boolean {
        return (Math.abs(offset) - this.getScrollBottomOffset(containerHeight, actualRowCount, rowHeight)) >= 0;
    }

    public getScrollBottomOffset(containerHeight: number, actualRowCount: number, rowHeight: number): number {
        return this.getVirtualHeight(actualRowCount, rowHeight) - containerHeight;
    }

    public getVirtualHeight(actualRowCount: number, rowHeight: number): number {
        return actualRowCount * rowHeight;
    }

    public getVirtualWidth(actualColumnCount: number, columnWidth: number): number {
        return actualColumnCount * columnWidth;
    }
}