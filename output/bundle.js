window["Cyz"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./common/event-base.ts":
/*!******************************!*\
  !*** ./common/event-base.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventBase = /** @class */ (function () {
    function EventBase() {
        this._eventDictionary = {};
    }
    EventBase.prototype.addEventListener = function (name, fn) {
        if (!Array.isArray(this._eventDictionary[name])) {
            this._eventDictionary[name] = [];
        }
        if (this._eventDictionary[name].indexOf(fn) !== -1) {
            return;
        }
        this._eventDictionary[name].push(fn);
    };
    EventBase.prototype.removeEventListener = function (name, fn) {
        if (!Array.isArray(this._eventDictionary[name])) {
            return;
        }
        var index = this._eventDictionary[name].indexOf(fn);
        if (index === -1) {
            return;
        }
        this._eventDictionary[name].splice(index, 1);
    };
    EventBase.prototype.raise = function (name, args) {
        var _this = this;
        var handlers = this._eventDictionary[name];
        if (!Array.isArray(handlers) || handlers.length === 0) {
            return;
        }
        args.name = name;
        handlers.forEach(function (fn) {
            fn(_this, args);
        });
    };
    return EventBase;
}());
exports.EventBase = EventBase;


/***/ }),

/***/ "./main.ts":
/*!*****************!*\
  !*** ./main.ts ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var virtual_container_1 = __webpack_require__(/*! ./view/virtual-container */ "./view/virtual-container.ts");
exports.VirtualContainer = virtual_container_1.VirtualContainer;


/***/ }),

/***/ "./operation-algorithm/circular-queue.ts":
/*!***********************************************!*\
  !*** ./operation-algorithm/circular-queue.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var event_base_1 = __webpack_require__(/*! ../common/event-base */ "./common/event-base.ts");
var CircularQueue = /** @class */ (function (_super) {
    __extends(CircularQueue, _super);
    function CircularQueue(count) {
        var _this = _super.call(this) || this;
        _this._count = count;
        _this._start = 0;
        _this._end = count - 1;
        return _this;
    }
    CircularQueue.prototype.moveUp = function (offset) {
        var count = this.getMoveCount(offset);
        var changes = [];
        for (var i = this._start; i < this._start + count; i++) {
            changes.push({
                oldIndex: i,
                newIndex: i + offset
            });
        }
        this.raiseEvent(changes);
        this.updatePointer(offset);
    };
    CircularQueue.prototype.moveDown = function (offset) {
        var count = this.getMoveCount(offset);
        var changes = [];
        for (var i = this._end; i > this._end - count; i--) {
            changes.push({
                oldIndex: i,
                newIndex: i - offset
            });
        }
        this.raiseEvent(changes);
        this.updatePointer(-offset);
    };
    CircularQueue.prototype.updatePointer = function (offset) {
        this._start += offset;
        this._end += offset;
    };
    CircularQueue.prototype.raiseEvent = function (changes) {
        this.raise(QueueEvent.IndexChanged, {
            changes: changes
        });
    };
    CircularQueue.prototype.getMoveCount = function (offset) {
        if (offset < this._count) {
            return offset;
        }
        else {
            return this._count;
        }
    };
    return CircularQueue;
}(event_base_1.EventBase));
exports.CircularQueue = CircularQueue;
var QueueEvent;
(function (QueueEvent) {
    QueueEvent["IndexChanged"] = "indexchange";
})(QueueEvent = exports.QueueEvent || (exports.QueueEvent = {}));


/***/ }),

/***/ "./service/virtual-container.service.ts":
/*!**********************************************!*\
  !*** ./service/virtual-container.service.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var VirualContainerService = /** @class */ (function () {
    function VirualContainerService() {
    }
    VirualContainerService.prototype.getRowPosition = function (rowIndex, rowHeight) {
        return rowIndex * rowHeight;
    };
    VirualContainerService.prototype.getVirtualRowCount = function (containerHeight, rowHeight) {
        return Math.round(containerHeight / rowHeight) + 2;
    };
    VirualContainerService.prototype.getScrolledRowCount = function (offset, rowHeight) {
        return Math.floor(offset / rowHeight);
    };
    VirualContainerService.prototype.isScrollBottom = function (offset, containerHeight, actualRowCount, rowHeight) {
        return (Math.abs(offset) - this.getScrollBottomOffset(containerHeight, actualRowCount, rowHeight)) >= 0;
    };
    VirualContainerService.prototype.getScrollBottomOffset = function (containerHeight, actualRowCount, rowHeight) {
        return this.getVirtualHeight(actualRowCount, rowHeight) - containerHeight;
    };
    VirualContainerService.prototype.getVirtualHeight = function (actualRowCount, rowHeight) {
        return actualRowCount * rowHeight;
    };
    return VirualContainerService;
}());
exports.VirualContainerService = VirualContainerService;


/***/ }),

/***/ "./view/virtual-container.ts":
/*!***********************************!*\
  !*** ./view/virtual-container.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var circular_queue_1 = __webpack_require__(/*! ../operation-algorithm/circular-queue */ "./operation-algorithm/circular-queue.ts");
var virtual_container_service_1 = __webpack_require__(/*! ../service/virtual-container.service */ "./service/virtual-container.service.ts");
var VirtualContainer = /** @class */ (function () {
    function VirtualContainer(container, rowCount, rowHeight) {
        if (rowHeight === void 0) { rowHeight = 30; }
        this._scrolledRowCount = 0;
        this.init(container, rowCount, rowHeight);
    }
    //#region CSS
    VirtualContainer.prototype.getContainerClassName = function () {
        return "virtual-container";
    };
    VirtualContainer.prototype.getVirtualCanvasClassName = function () {
        return 'virtual-canvas';
    };
    VirtualContainer.prototype.getRowClassName = function () {
        return "virtual-container-row";
    };
    VirtualContainer.prototype.getRowIndexClassName = function (rowIndex) {
        return "virtual-container-r" + rowIndex;
    };
    //#endregion
    //#region HTML
    VirtualContainer.prototype.initElement = function () {
        this._container.classList.add(this.getContainerClassName());
        var virtualCanvas = this.createVirtualCanvas();
        virtualCanvas.appendChild(this.createVirtualCanvasContent());
        this._container.appendChild(virtualCanvas);
    };
    VirtualContainer.prototype.createVirtualCanvas = function () {
        var div = document.createElement('div');
        div.classList.add(this.getVirtualCanvasClassName());
        div.style.position = 'relative';
        div.style.width = '100%';
        div.style.height = this._service.getVirtualHeight(this._actualRowCount, this._rowHeight) + 'px';
        return div;
    };
    VirtualContainer.prototype.createVirtualCanvasContent = function () {
        var count = this._virtualRowCount;
        var fragement = document.createDocumentFragment();
        for (var i = 0; i < count; i++) {
            fragement.appendChild(this.createRowElement(i));
        }
        return fragement;
    };
    VirtualContainer.prototype.createRowElement = function (rowIndex) {
        var rowElement = document.createElement('div');
        rowElement.classList.add(this.getRowClassName());
        rowElement.classList.add(this.getRowIndexClassName(rowIndex));
        rowElement.style.position = 'absolute';
        rowElement.style.width = '100%';
        rowElement.style.height = this._rowHeight + "px";
        rowElement.style.top = this._service.getRowPosition(rowIndex, this._rowHeight) + "px";
        // rowElement.innerHTML = rowIndex.toString();
        return rowElement;
    };
    VirtualContainer.prototype.getRowElement = function (rowIndex) {
        return this._container.querySelector("." + this.getRowIndexClassName(rowIndex));
    };
    //#endregion
    //#region row position
    VirtualContainer.prototype.updateRowPosition = function (oldIndex, newIndex) {
        var rowElement = this.getRowElement(oldIndex);
        rowElement.classList.remove(this.getRowIndexClassName(oldIndex));
        rowElement.classList.add(this.getRowIndexClassName(newIndex));
        this.setRowPosition(newIndex, this._service.getRowPosition(newIndex, this._rowHeight));
    };
    VirtualContainer.prototype.setRowPosition = function (rowIndex, top) {
        var ele = this.getRowElement(rowIndex);
        ele.style.top = this._service.getRowPosition(rowIndex, this._rowHeight) + "px";
    };
    //#endregion
    VirtualContainer.prototype.init = function (container, rowCount, rowHeight) {
        this._service = new virtual_container_service_1.VirualContainerService();
        this._container = container;
        this._rowHeight = rowHeight;
        this._actualRowCount = rowCount;
        this._virtualRowCount = this._service.getVirtualRowCount(this._container.offsetHeight, this._rowHeight);
        this._circulerQueue = new circular_queue_1.CircularQueue(this._virtualRowCount);
        this.initElement();
        this.bindEvent();
    };
    VirtualContainer.prototype.bindEvent = function () {
        var _this = this;
        this._container.addEventListener('scroll', function () { return _this.scroll(_this._container.scrollTop); });
        this._circulerQueue.addEventListener(circular_queue_1.QueueEvent.IndexChanged, this.positionChange.bind(this));
    };
    VirtualContainer.prototype.scroll = function (offset) {
        if (this._service.isScrollBottom(offset, this._container.offsetHeight, this._actualRowCount, this._rowHeight)) {
            offset = this._service.getScrollBottomOffset(this._container.offsetHeight, this._actualRowCount, this._rowHeight);
        }
        var scrolledRowCount = this._service.getScrolledRowCount(offset, this._rowHeight);
        if (scrolledRowCount === this._scrolledRowCount) {
            return;
        }
        var offsetRowCount = Math.abs(scrolledRowCount - this._scrolledRowCount);
        if (scrolledRowCount > this._scrolledRowCount) {
            this._circulerQueue.moveUp(offsetRowCount);
        }
        else {
            this._circulerQueue.moveDown(offsetRowCount);
        }
        this._scrolledRowCount = scrolledRowCount;
    };
    VirtualContainer.prototype.positionChange = function (sender, args) {
        var _this = this;
        args.changes.forEach(function (change) {
            _this.updateRowPosition(change.oldIndex, change.newIndex);
        });
        // this.getRowElement(args.newIndex).innerHTML = args.newIndex.toString();
    };
    return VirtualContainer;
}());
exports.VirtualContainer = VirtualContainer;


/***/ })

/******/ });