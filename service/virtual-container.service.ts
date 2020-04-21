import { CircularQueue, QueueEvent, IndexChangeArgs } from "../operation-algorithm/circular-queue";
import { VirualContainerServiceConfig } from "./virtual-container.service.type";

export class VirualContainerService {

    public getRowPosition(rowIndex: number, rowHeight: number): number {
        return rowIndex * rowHeight;
    }

    public getVirtualRowCount(containerHeight: number, rowHeight: number): number {
        return Math.round(containerHeight / rowHeight) + 2;
    }

    public getScrolledRowCount(offset: number, rowHeight: number): number {
        return Math.floor(offset / rowHeight);
    }

    public isScrollBottom(offset: number, containerHeight: number, virtualRowCount: number, rowHeight: number): boolean {
        return (Math.abs(offset) - this.getScrollBottomOffset(containerHeight, virtualRowCount, rowHeight)) >= 0;
    }

    public getScrollBottomOffset(containerHeight: number, virtualRowCount: number, rowHeight: number): number {
        return this.getVirtualHeight(virtualRowCount, rowHeight) - containerHeight;
    }

    public getVirtualHeight(actualRowCount: number, rowHeight: number): number {
        return actualRowCount * rowHeight;
    }
}